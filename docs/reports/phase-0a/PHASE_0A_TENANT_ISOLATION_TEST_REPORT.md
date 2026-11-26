# Phase 0A Tenant Isolation Test Report

## Test Environment
- **Target**: Dedicated disposable PostgreSQL 16 database `medicore_hms_test` on `127.0.0.1:5433` (never run against existing dev/prod data).
- **Migrations**: `alembic upgrade head` → `alembic downgrade base` → `alembic upgrade head` executed as `medicore_migrator`.
- **Runtime Connection**: Executed as restricted `medicore_app` role via `backend/tests/test_tenant_isolation_pg.py` with `pool_size=1, max_overflow=0`.

## Verified Assertions (15/15)
1. `medicore_app` is non-superuser (`rolsuper = false`).
2. `medicore_app` has no `BYPASSRLS` (`rolbypassrls = false`).
3. `medicore_app` cannot execute DDL (`CREATE TABLE` raises `ProgrammingError` / insufficient privilege).
4. `medicore_app` cannot assume `medicore_migrator` (`SET ROLE medicore_migrator` rejected).
5. `audit_logs` has `relrowsecurity = true` and `relforcerowsecurity = true` (`FORCE ROW LEVEL SECURITY` via migration `20261127_0002`).
6. Hospital A (`DEMO-A`) cannot read Hospital B (`DEMO-B`) audit records.
7. Hospital B cannot read Hospital A audit records.
8. Cross-tenant `INSERT` (Hospital A context inserting Hospital B `hospital_id`) is rejected by RLS `WITH CHECK`.
9. Unauthorized tenant reassignment (`UPDATE audit_logs SET ...`) is rejected.
10. Missing tenant context fails closed (`SELECT` returns `[]`; `INSERT` with `hospital_id` rejected).
11. Invalid tenant context (`'not-a-valid-uuid'`) returns `[]`.
12. Transaction-scoped `set_config('app.current_hospital_id', ..., true)` is cleared on `commit()` / `rollback()`.
13. Connection-pool reuse (`pool_size=1`) after Hospital B commit does not leak context into the next transaction.
14. `UPDATE` and `DELETE` on `audit_logs` are rejected for `medicore_app` (`InsufficientPrivilegeError`).
15. Global audit events (`hospital_id IS NULL`) are rejected unless `app.allow_global_audit = 'true'`.

## Trusted Boundary Note
Session settings alone do not provide complete tenant isolation. Complete isolation requires trusted server-side derivation of `hospital_id` from authenticated claims (Phase 1 M01), application-layer authorization, restricted `medicore_app` privileges, and PostgreSQL RLS as defense in depth.
