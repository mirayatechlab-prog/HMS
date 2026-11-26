---
description: Standard workflow for executing an approved MediCore HMS development phase
---
# Phase Implementation Workflow
1. Confirm explicit approval for the target phase and review `docs/phases/MVP_DEVELOPMENT_ROADMAP.md`.
2. Inspect existing codebase, runtime environment, and open blockers from the previous phase.
3. Break work into bounded packages (Architecture, DB/Migrations, Backend, Frontend, Security, Verification).
4. Implement changes adhering strictly to `AGENTS.md` (dynamic capacity, tenant isolation, Decimal money, clinical invariants).
5. Run automated tests, linters, type checks, and browser verification.
6. Generate all required phase reports and execute the Phase Acceptance workflow before concluding.
