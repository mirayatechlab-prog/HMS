# Phase 1 Implementation Plan (Pending Phase 0 Approval)

## Scope (M01, M02, M03, M04)
1. **M01 — Identity & RBAC**: Users, configurable roles, granular permissions, Argon2id, JWT + HTTP-only refresh rotation, TOTP MFA for privileged roles, tenant-isolation integration tests.
2. **M02 — Hospital Setup Wizard**: Persist 9-step onboarding draft & activation state; allow zero-bed activation.
3. **M03 — Dynamic Infrastructure**: Full CRUD + bulk creation for Buildings, Floors, Wards, Room Categories, Rooms, Beds, effective-dated Tariffs, and `infrastructure_audit_history`; verify 0, 5, 30, 100, and 500 bed fixtures.
4. **M04 — Staff & Doctor Management**: Permanent & visiting doctor profiles, registration numbers, schedules, fee rules, and staff role assignments.

## Entry Criteria
- Phase 0 Acceptance Decision = `PASS` or `CONDITIONAL PASS` with explicit user approval to start Phase 1.
