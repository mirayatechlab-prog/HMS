# Phase 0 Open Blockers

| ID | Blocker / Limitation | Severity | Owner | Impact |
|---|---|---|---|---|
| BLK-01 | Chrome remote debugging (`DevToolsActivePort`) unavailable for live browser verification & screenshots of the 9 UI previews | Medium (Gate G) | Environment / User | Visual layout, console error, and tablet overflow checks in a live browser remain unverified until Chrome remote debugging is enabled. |
| BLK-02 | Host port `5432` already occupied by local PostgreSQL; Compose mapped host port `5433:5432` | Low (Resolved for Compose) | DevOps | Docker containers communicate on internal `5432`; host tools must use `5433`. |
| BLK-03 | `npm audit` reported 22 transitive vulnerabilities (2 critical, 8 high in dev/build toolchain) | Medium | Frontend / Security | Must be triaged/upgraded in Phase 1 before staging deployment. |
| BLK-04 | Unresolved hospital business rules (`SQ-01` to `SQ-06` in `STAKEHOLDER_QUESTIONS.md`) | Medium (Phase 3–5) | Hospital Stakeholders | Does not block Phase 1 (M01–M04), but required before Phase 3/5 implementation. |
