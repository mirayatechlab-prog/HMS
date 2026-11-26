"""Harden audit_logs immutability and RLS enforcement for medicore_app.

Revision ID: 20261127_0002
Revises: 20261127_0001
Create Date: 2026-11-27 02:30:00+00:00
"""

from collections.abc import Sequence

from alembic import op

revision: str = "20261127_0002"
down_revision: str | Sequence[str] | None = "20261127_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Enforce RLS even for table owner as defense-in-depth
    op.execute("ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;")

    # Enforce append-only audit_logs for runtime role (no UPDATE or DELETE)
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'medicore_app') THEN
                REVOKE UPDATE, DELETE ON TABLE audit_logs FROM medicore_app;
                GRANT SELECT, INSERT ON TABLE audit_logs TO medicore_app;
                GRANT SELECT, INSERT, UPDATE ON TABLE hospitals TO medicore_app;
            END IF;
        END
        $$;
        """
    )

    # Tighten policy so global (hospital_id IS NULL) records require explicit opt-in context
    op.execute("DROP POLICY IF EXISTS audit_logs_tenant_isolation ON audit_logs;")
    op.execute(
        """
        CREATE POLICY audit_logs_tenant_isolation ON audit_logs
        USING (
            (
                hospital_id IS NOT NULL
                AND hospital_id::text = NULLIF(current_setting('app.current_hospital_id', true), '')
            )
            OR (
                hospital_id IS NULL
                AND current_setting('app.allow_global_audit', true) = 'true'
            )
        )
        WITH CHECK (
            (
                hospital_id IS NOT NULL
                AND hospital_id::text = NULLIF(current_setting('app.current_hospital_id', true), '')
            )
            OR (
                hospital_id IS NULL
                AND current_setting('app.allow_global_audit', true) = 'true'
            )
        );
        """
    )


def downgrade() -> None:
    op.execute("DROP POLICY IF EXISTS audit_logs_tenant_isolation ON audit_logs;")
    op.execute(
        """
        CREATE POLICY audit_logs_tenant_isolation ON audit_logs
        USING (
            hospital_id IS NULL
            OR hospital_id::text = current_setting('app.current_hospital_id', true)
        )
        WITH CHECK (
            hospital_id IS NULL
            OR hospital_id::text = current_setting('app.current_hospital_id', true)
        );
        """
    )
    op.execute("ALTER TABLE audit_logs NO FORCE ROW LEVEL SECURITY;")
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'medicore_app') THEN
                GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE audit_logs TO medicore_app;
            END IF;
        END
        $$;
        """
    )
