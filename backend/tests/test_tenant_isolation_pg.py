"""PostgreSQL tenant-isolation, RLS, and privilege verification tests (disposable DB).

These tests run against a dedicated disposable database (`medicore_hms_test`)
created and migrated by `medicore_migrator`, then exercised via the restricted
`medicore_app` runtime role.
"""

import os
import subprocess
import sys
import uuid
from collections.abc import AsyncGenerator
from pathlib import Path

import psycopg
import pytest
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError, ProgrammingError
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.db.session import set_tenant_context

PG_HOST = os.getenv("TEST_PG_HOST", "127.0.0.1")
PG_PORT = os.getenv("TEST_PG_PORT", "5433")
MIGRATOR_USER = os.getenv("POSTGRES_MIGRATOR_USER", "medicore_migrator")
MIGRATOR_PASS = os.getenv("POSTGRES_MIGRATOR_PASSWORD", "dev_migrator_password_change_me")
APP_USER = os.getenv("POSTGRES_APP_USER", "medicore_app")
APP_PASS = os.getenv("POSTGRES_APP_PASSWORD", "dev_app_password_change_me")
DISPOSABLE_DB = "medicore_hms_test"

ADMIN_PSYCOPG_URL = f"postgresql://{MIGRATOR_USER}:{MIGRATOR_PASS}@{PG_HOST}:{PG_PORT}/postgres"
TEST_MIGRATION_URL = (
    f"postgresql+psycopg://{MIGRATOR_USER}:{MIGRATOR_PASS}@{PG_HOST}:{PG_PORT}/{DISPOSABLE_DB}"
)
TEST_APP_ASYNC_URL = (
    f"postgresql+asyncpg://{APP_USER}:{APP_PASS}@{PG_HOST}:{PG_PORT}/{DISPOSABLE_DB}"
)


@pytest.fixture(scope="module")
def disposable_db_ready() -> None:
    """Create disposable DB, test Alembic upgrade -> downgrade -> upgrade, and grant role."""
    try:
        with psycopg.connect(ADMIN_PSYCOPG_URL, autocommit=True) as conn:
            conn.execute(f"DROP DATABASE IF EXISTS {DISPOSABLE_DB} WITH (FORCE);")
            conn.execute(f"CREATE DATABASE {DISPOSABLE_DB} OWNER {MIGRATOR_USER};")
        with psycopg.connect(
            f"postgresql://{MIGRATOR_USER}:{MIGRATOR_PASS}@{PG_HOST}:{PG_PORT}/{DISPOSABLE_DB}",
            autocommit=True,
        ) as conn:
            conn.execute(f"GRANT CONNECT ON DATABASE {DISPOSABLE_DB} TO {APP_USER};")
            conn.execute(f"GRANT USAGE ON SCHEMA public TO {APP_USER};")
    except psycopg.OperationalError as exc:
        pytest.skip(f"Disposable PostgreSQL not reachable on {PG_HOST}:{PG_PORT}: {exc}")

    backend_dir = str(Path(__file__).resolve().parents[1])
    env = os.environ.copy()
    env["DATABASE_MIGRATION_URL"] = TEST_MIGRATION_URL
    env["DATABASE_URL"] = TEST_APP_ASYNC_URL
    alembic_bin = str(Path(sys.executable).parent / "alembic")

    # Verify upgrade -> downgrade base -> upgrade head on disposable DB
    subprocess.run([alembic_bin, "upgrade", "head"], cwd=backend_dir, env=env, check=True)  # noqa: S603
    subprocess.run([alembic_bin, "downgrade", "base"], cwd=backend_dir, env=env, check=True)  # noqa: S603
    subprocess.run([alembic_bin, "upgrade", "head"], cwd=backend_dir, env=env, check=True)  # noqa: S603


@pytest.fixture
async def app_engine(disposable_db_ready: None) -> AsyncGenerator[AsyncEngine]:
    """Single-connection pooled engine as medicore_app to test pool reuse & RLS."""
    eng = create_async_engine(TEST_APP_ASYNC_URL, pool_size=1, max_overflow=0)
    try:
        yield eng
    finally:
        await eng.dispose()


async def test_runtime_role_privileges_and_rls_metadata(app_engine: AsyncEngine) -> None:
    """Verify medicore_app is non-superuser, NOBYPASSRLS, no DDL, and cannot SET ROLE migrator."""
    maker = async_sessionmaker(app_engine, class_=AsyncSession, expire_on_commit=False)
    async with maker() as session:
        role_row = (
            await session.execute(
                text(
                    "SELECT rolsuper, rolbypassrls, rolcreaterole, rolcreatedb "
                    "FROM pg_roles WHERE rolname = 'medicore_app'"
                )
            )
        ).one()
        assert role_row.rolsuper is False
        assert role_row.rolbypassrls is False
        assert role_row.rolcreaterole is False
        assert role_row.rolcreatedb is False

        rls_row = (
            await session.execute(
                text(
                    "SELECT relrowsecurity, relforcerowsecurity "
                    "FROM pg_class WHERE relname = 'audit_logs'"
                )
            )
        ).one()
        assert rls_row.relrowsecurity is True
        assert rls_row.relforcerowsecurity is True

        with pytest.raises(ProgrammingError):
            await session.execute(text("CREATE TABLE unauthorized_ddl_test (id int);"))
        await session.rollback()

        with pytest.raises(ProgrammingError):
            await session.execute(text("SET ROLE medicore_migrator;"))
        await session.rollback()


async def test_tenant_isolation_rls_immutability_and_pool_reuse(app_engine: AsyncEngine) -> None:
    """Verify Hospital A/B isolation, fail-closed context, immutability, and pool reuse."""
    hosp_a = uuid.uuid4()
    hosp_b = uuid.uuid4()
    audit_a = uuid.uuid4()
    audit_b = uuid.uuid4()
    audit_global = uuid.uuid4()

    maker = async_sessionmaker(app_engine, class_=AsyncSession, expire_on_commit=False)

    # Seed two fictional hospital tenants
    async with maker() as session:
        await session.execute(
            text(
                "INSERT INTO hospitals (id, code, name) VALUES "
                "(:ha, 'DEMO-A', 'Demo Hospital A'), (:hb, 'DEMO-B', 'Demo Hospital B')"
            ),
            {"ha": hosp_a, "hb": hosp_b},
        )
        await set_tenant_context(session, hosp_a)
        await session.execute(
            text(
                "INSERT INTO audit_logs (id, hospital_id, action, entity_type) "
                "VALUES (:id, :hid, 'HOSP_A_EVENT', 'hospital')"
            ),
            {"id": audit_a, "hid": hosp_a},
        )
        await session.commit()

    async with maker() as session:
        await set_tenant_context(session, hosp_b)
        await session.execute(
            text(
                "INSERT INTO audit_logs (id, hospital_id, action, entity_type) "
                "VALUES (:id, :hid, 'HOSP_B_EVENT', 'hospital')"
            ),
            {"id": audit_b, "hid": hosp_b},
        )
        await session.commit()

    # 1. Pool reuse after commit must NOT leak Hospital B context into next transaction
    async with maker() as session:
        leaked_setting = (
            await session.execute(text("SELECT current_setting('app.current_hospital_id', true)"))
        ).scalar_one()
        assert leaked_setting in (None, "")
        rows_without_ctx = (
            (await session.execute(text("SELECT id FROM audit_logs"))).scalars().all()
        )
        assert rows_without_ctx == []

        # Missing tenant context must reject tenant insert (fail-closed)
        with pytest.raises(DBAPIError):
            await session.execute(
                text(
                    "INSERT INTO audit_logs (id, hospital_id, action, entity_type) "
                    "VALUES (:id, :hid, 'NO_CTX_EVENT', 'hospital')"
                ),
                {"id": uuid.uuid4(), "hid": hosp_a},
            )
        await session.rollback()

    # 2. Hospital A sees only A; cannot see B; cannot insert B
    async with maker() as session:
        await set_tenant_context(session, hosp_a)
        ids_a = (await session.execute(text("SELECT id FROM audit_logs"))).scalars().all()
        assert ids_a == [audit_a]

        with pytest.raises(DBAPIError):
            await session.execute(
                text(
                    "INSERT INTO audit_logs (id, hospital_id, action, entity_type) "
                    "VALUES (:id, :hid, 'CROSS_TENANT', 'hospital')"
                ),
                {"id": uuid.uuid4(), "hid": hosp_b},
            )
        await session.rollback()

    # 3. Hospital B sees only B
    async with maker() as session:
        await set_tenant_context(session, hosp_b)
        ids_b = (await session.execute(text("SELECT id FROM audit_logs"))).scalars().all()
        assert ids_b == [audit_b]

        # Audit records cannot be updated or deleted by medicore_app
        with pytest.raises(ProgrammingError):
            await session.execute(
                text("UPDATE audit_logs SET action = 'TAMPERED' WHERE id = :id"),
                {"id": audit_b},
            )
        await session.rollback()

        with pytest.raises(ProgrammingError):
            await session.execute(
                text("DELETE FROM audit_logs WHERE id = :id"),
                {"id": audit_b},
            )
        await session.rollback()

    # 4. Invalid tenant context string cannot expose any hospital records
    async with maker() as session:
        await session.execute(
            text("SELECT set_config('app.current_hospital_id', 'not-a-valid-uuid', true)")
        )
        rows_invalid = (await session.execute(text("SELECT id FROM audit_logs"))).scalars().all()
        assert rows_invalid == []

    # 5. Global audit events (hospital_id IS NULL) require explicit app.allow_global_audit='true'
    async with maker() as session:
        with pytest.raises(DBAPIError):
            await session.execute(
                text(
                    "INSERT INTO audit_logs (id, hospital_id, action, entity_type) "
                    "VALUES (:id, NULL, 'GLOBAL_UNAUTH', 'system')"
                ),
                {"id": audit_global},
            )
        await session.rollback()

        await session.execute(text("SELECT set_config('app.allow_global_audit', 'true', true)"))
        await session.execute(
            text(
                "INSERT INTO audit_logs (id, hospital_id, action, entity_type) "
                "VALUES (:id, NULL, 'GLOBAL_AUTH', 'system')"
            ),
            {"id": audit_global},
        )
        await session.commit()
