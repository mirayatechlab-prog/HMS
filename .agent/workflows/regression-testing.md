---
description: Full backend and frontend regression testing workflow
---
# Regression Testing Workflow
1. Backend: run `ruff check`, `mypy`, and `pytest` against PostgreSQL & Redis.
2. Frontend: run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` (with `VITE_ENABLE_PHASE0_PREVIEWS=false` to verify preview exclusion).
3. Record exact commands, exit codes, and pass/fail/skipped counts.
