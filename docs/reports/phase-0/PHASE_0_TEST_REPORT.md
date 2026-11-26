# Phase 0 Test Report

## Executed Automated Checks

| Suite | Command | Exit Code | Result |
|---|---|---|---|
| Backend Lint | `.venv/bin/ruff check app tests` | `0` | All checks passed |
| Backend Format | `.venv/bin/ruff format --check app tests` | `0` | 39 files formatted |
| Backend Typecheck | `.venv/bin/mypy app` | `0` | Success: no issues found in 37 source files |
| Backend Tests | `.venv/bin/pytest -v` | `0` | **6 passed** in 1.64s (liveness, correlation ID, error envelope, readiness ok, readiness 503 no-leak, env validation) |
| Frontend Typecheck | `npm run typecheck` (`tsc --noEmit`) | `0` | 0 errors |
| Frontend Lint | `npm run lint` (`eslint .`) | `0` | 0 errors, 2 `react-refresh/only-export-components` warnings |
| Frontend Tests | `npm run test` (`vitest run`) | `0` | **5 passed** (0/5/30/100/500 beds capacity, mixed rooms, active/inactive, StatusBadge, SummaryCard) |

## Not Executed / Deferred
- End-to-end Playwright browser suite (`@playwright/test` installed; browser binaries & E2E specs deferred to Phase 1 / blocked on Chrome DevTools port in Phase 0).
- `pip-audit` vulnerability scan (configured in GitHub Actions CI).
