---
description: Architecture and module boundary review workflow
---
# Architecture Review Workflow
1. Verify modular monolith boundaries under `backend/app/modules/` and `frontend/src/features/`.
2. Confirm zero hardcoded capacity assumptions (0, 5, 30, 100, 500+ beds supported).
3. Verify `/api/v1` versioning, standardized error envelopes, and `X-Correlation-ID` propagation.
4. Check `docs/architecture/ARCHITECTURE_DECISIONS.md` and `MODULE_BOUNDARIES.md` for drift.
