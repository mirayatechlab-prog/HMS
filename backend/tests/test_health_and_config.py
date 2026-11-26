"""Phase 0 backend foundation tests."""

import os
from collections.abc import AsyncGenerator
from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

# Ensure test environment variables exist before importing app modules
os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("SECRET_KEY", "test-secret-key-minimum-32-characters-long")
os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+asyncpg://medicore_app:dev_app_password_change_me@localhost:5432/medicore_hms",
)
os.environ.setdefault(
    "DATABASE_MIGRATION_URL",
    "postgresql+psycopg://medicore_migrator:dev_migrator_password_change_me@localhost:5432/medicore_hms",
)
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

from app.core.config import Settings  # noqa: E402
from app.core.exceptions import AppError  # noqa: E402
from app.main import create_app  # noqa: E402


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient]:
    """Create an async test client against the FastAPI app."""
    app = create_app()

    @app.get("/api/v1/_test-error")
    async def trigger_test_error() -> None:
        raise AppError(
            code="TEST_DOMAIN_ERROR",
            message="Simulated domain failure",
            status_code=409,
        )

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as async_client:
        yield async_client


async def test_liveness_endpoint_independent_of_dependencies(client: AsyncClient) -> None:
    """Liveness must return 200 even if external services are not queried."""
    response = await client.get("/api/v1/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "alive", "service": "medicore-hms"}
    assert "X-Correlation-ID" in response.headers


async def test_correlation_id_propagation(client: AsyncClient) -> None:
    """Incoming X-Correlation-ID must be echoed back."""
    cid = "test-corr-id-12345"
    response = await client.get("/api/v1/health/live", headers={"X-Correlation-ID": cid})
    assert response.status_code == 200
    assert response.headers["X-Correlation-ID"] == cid


async def test_standardized_error_envelope(client: AsyncClient) -> None:
    """AppError must serialize to the standardized error envelope with correlation_id."""
    cid = "err-corr-999"
    response = await client.get("/api/v1/_test-error", headers={"X-Correlation-ID": cid})
    assert response.status_code == 409
    body = response.json()
    assert body["error"]["code"] == "TEST_DOMAIN_ERROR"
    assert body["error"]["message"] == "Simulated domain failure"
    assert body["error"]["correlation_id"] == cid


async def test_readiness_when_dependencies_ok(client: AsyncClient) -> None:
    """Readiness returns 200 when both PostgreSQL and Redis checks pass."""
    with (
        patch("app.api.v1.health.check_database_ready", new=AsyncMock(return_value=True)),
        patch("app.api.v1.health.check_redis_ready", new=AsyncMock(return_value=True)),
    ):
        response = await client.get("/api/v1/health/ready")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ready",
        "checks": {"database": "ok", "redis": "ok"},
    }


async def test_readiness_dependency_failure_returns_503_without_leaking_secrets(
    client: AsyncClient,
) -> None:
    """Readiness returns 503 with sanitized status when DB or Redis is unavailable."""
    with (
        patch("app.api.v1.health.check_database_ready", new=AsyncMock(return_value=False)),
        patch("app.api.v1.health.check_redis_ready", new=AsyncMock(return_value=True)),
    ):
        response = await client.get("/api/v1/health/ready")
    assert response.status_code == 503
    payload = response.json()
    assert payload == {
        "status": "not_ready",
        "checks": {"database": "unavailable", "redis": "ok"},
    }
    assert "postgres" not in response.text.lower()
    assert "password" not in response.text.lower()


def test_environment_validation_rejects_invalid_urls_and_prod_placeholder_secret() -> None:
    """Settings must reject non-asyncpg runtime DB URLs and insecure prod secrets."""
    with pytest.raises(ValidationError):
        Settings(
            APP_ENV="development",
            SECRET_KEY="a" * 32,
            DATABASE_URL="postgresql://user:pass@localhost:5432/db",
            DATABASE_MIGRATION_URL="postgresql+psycopg://user:pass@localhost:5432/db",
            REDIS_URL="redis://localhost:6379/0",
        )

    with pytest.raises(ValidationError):
        Settings(
            APP_ENV="production",
            SECRET_KEY="dev-only-insecure-secret-key-change-before-staging-min-32-chars",  # noqa: S106
            DATABASE_URL="postgresql+asyncpg://user:pass@localhost:5432/db",
            DATABASE_MIGRATION_URL="postgresql+psycopg://user:pass@localhost:5432/db",
            REDIS_URL="redis://localhost:6379/0",
        )


def test_valid_environment_configuration_defaults() -> None:
    """Valid settings parse cleanly with expected Indian healthcare defaults."""
    cfg = Settings(
        APP_ENV="development",
        SECRET_KEY="valid-local-dev-secret-key-at-least-32-chars",  # noqa: S106
        DATABASE_URL="postgresql+asyncpg://medicore_app:pass@localhost:5432/medicore_hms",
        DATABASE_MIGRATION_URL="postgresql+psycopg://medicore_migrator:pass@localhost:5432/medicore_hms",
        REDIS_URL="redis://localhost:6379/0",
        CORS_ORIGINS="http://localhost:5173, https://hms.example.org",
    )
    assert cfg.DEFAULT_TIMEZONE == "Asia/Kolkata"
    assert cfg.DEFAULT_CURRENCY == "INR"
    assert cfg.cors_origins_list == ["http://localhost:5173", "https://hms.example.org"]


async def test_unhandled_exception_redacts_internal_details() -> None:
    """Unhandled 500 errors must return sanitized envelope without internal exception text."""
    app = create_app()

    @app.get("/api/v1/_test-crash")
    async def trigger_crash() -> None:
        raise RuntimeError("secret-db-password-leak")

    transport = ASGITransport(app=app, raise_app_exceptions=False)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        resp = await ac.get("/api/v1/_test-crash", headers={"X-Correlation-ID": "crash-cid-1"})
    assert resp.status_code == 500
    body = resp.json()
    assert body["error"]["code"] == "INTERNAL_SERVER_ERROR"
    assert body["error"]["correlation_id"] == "crash-cid-1"
    assert "secret-db-password-leak" not in resp.text


async def test_environment_aware_cors_headers(client: AsyncClient) -> None:
    """Allowed origin receives CORS header; disallowed origin does not."""
    allowed = await client.get(
        "/api/v1/health/live",
        headers={"Origin": "http://localhost:5173"},
    )
    assert allowed.headers.get("access-control-allow-origin") == "http://localhost:5173"

    disallowed = await client.get(
        "/api/v1/health/live",
        headers={"Origin": "https://evil.example.com"},
    )
    assert "access-control-allow-origin" not in disallowed.headers
