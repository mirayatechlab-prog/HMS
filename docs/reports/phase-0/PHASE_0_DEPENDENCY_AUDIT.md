# Phase 0 Dependency Audit

## Backend (`backend/requirements.lock`, Python 3.13.5 on Apple Silicon `arm64`)
- Core dependencies pinned: `fastapi==0.115.6`, `uvicorn==0.32.1`, `pydantic==2.10.3`, `pydantic-settings==2.6.1`, `sqlalchemy==2.0.36`, `asyncpg==0.30.0`, `psycopg==3.2.3`, `alembic==1.14.0`, `redis==5.2.0`, `boto3==1.35.76`, `structlog==24.4.0`.
- Dev dependencies pinned: `pytest==8.3.4`, `pytest-asyncio==0.24.0`, `httpx==0.28.1`, `ruff==0.8.2`, `mypy==1.13.0`.
- **Note**: `pip-audit` was not run locally (configured in `.github/workflows/ci.yml`).

## Frontend (`frontend/package.json` + `package-lock.json`, Node v22.20.0)
- `npm install` audited 360 packages and reported **22 vulnerabilities (2 low, 10 moderate, 8 high, 2 critical)** in transitive dev/build dependencies (including `eslint@9.16.0` deprecation warning).
- **Action for Phase 1**: Run `npm audit` triage and upgrade transitive dev dependencies / `eslint` cleanly before Phase 1 CI enforcement.
