# Phase 0A Backend Dependency Audit

## Tool & Scope
- **Tool**: `pip-audit` executed inside `backend/.venv` against `backend/requirements.lock` (Python 3.13.5, Apple Silicon `arm64`).

## Baseline Findings
- `starlette==0.41.3` (transitive via `fastapi==0.115.6`): 14 advisory records (`PYSEC-2026-1941`, `PYSEC-2026-1942`, `PYSEC-2026-161`, `PYSEC-2026-2280`, `PYSEC-2026-2281`, `PYSEC-2026-248`, `PYSEC-2026-249`).
- `pytest==8.3.4` (dev): `PYSEC-2026-1845` (`CVE-2025-71176`, fixed in `>=9.0.3`).

## Remediation & Final Scan
- Pinned `fastapi==0.165.0` (bringing `starlette==1.10.0`), `pytest==9.2.0`, `pytest-asyncio==1.5.0` in `backend/pyproject.toml` and regenerated `backend/requirements.lock`.
- Re-ran `.venv/bin/pip-audit --local`: **No known vulnerabilities found** (0 vulnerabilities across all audited packages).
- Re-ran `ruff check`, `mypy --strict`, and `pytest` (11/11 passed).
