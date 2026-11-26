# Phase 0A Full Regression Report

| Check | Command | Exit Code | Actual Result |
|---|---|---|---|
| Compose Validation | `docker compose config --quiet` | `0` | Valid |
| Container Rebuild & Startup | `docker compose up -d --build` | `0` | All 5 containers running/healthy (`postgres`, `redis`, `s3`, `backend`, `frontend`) |
| Backend Lint & Format | `.venv/bin/ruff check app tests alembic/versions` | `0` | All checks passed |
| Backend Typecheck | `.venv/bin/mypy app` | `0` | 0 issues in 37 source files |
| Backend Tests (Unit + PG RLS + Rollback) | `.venv/bin/pytest -v` | `0` | **11 passed** in 6.36s |
| Backend Dependency Audit | `.venv/bin/pip-audit --local` | `0` | **No known vulnerabilities found** |
| Frontend Clean Install | `npm ci` | `0` | 324 packages installed reproducibly |
| Frontend Typecheck | `npm run typecheck` | `0` | 0 errors |
| Frontend Lint | `npm run lint` | `0` | 0 errors, 2 `react-refresh` warnings |
| Frontend Unit Tests | `npm run test` | `0` | **10 passed** (Vitest 5.1.2) |
| Frontend Prod Audit | `npm audit --omit=dev` | `0` (findings) | 0 critical, 0 high, 2 moderate (`react-router`) |
| Frontend Full Audit | `npm audit` | `0` (findings) | 0 critical, 0 high, 9 moderate |
| Prod Build & Preview Gate | `VITE_ENABLE_PHASE0_PREVIEWS=true npm run build` + Playwright | `0` | All 3 direct preview URLs rendered `ProductionGateFallback`, `demoBannerPresent: 0` |
| Playwright Browser & A11y | `node tests/browser-verify.mjs` | `0` | 9/9 routes, 4 viewports (`overflow: false`), 0 console/page errors, 10 screenshots |
| Secret Scan | `git grep` secret patterns | `0` | `NO_SECRETS_FOUND_IN_TRACKED_FILES` |

*Note*: GitHub Actions CI workflow (`.github/workflows/ci.yml`) is configured in the repo; no remote GitHub runner execution was triggered locally.
