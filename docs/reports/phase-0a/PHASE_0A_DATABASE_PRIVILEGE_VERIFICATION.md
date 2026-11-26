# Phase 0A Database Privilege Verification

## Role & Table Ownership Inspection
- **Migration Role (`medicore_migrator`)**: Owns `hospitals`, `audit_logs`, and `alembic_version`; executes all Alembic DDL.
- **Application Role (`medicore_app`)**:
  - `rolsuper = false`, `rolbypassrls = false`, `rolcreaterole = false`, `rolcreatedb = false`.
  - Privileges on `audit_logs`: `SELECT, INSERT` only (`UPDATE` and `DELETE` explicitly revoked in migration `20261127_0002`).
  - Privileges on `hospitals`: `SELECT, INSERT, UPDATE` (no `DELETE`, no DDL).
- **RLS Enforcement**: `ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY` + `ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY`.
- **Verification**: Confirmed via `backend/tests/test_tenant_isolation_pg.py` (`2 passed` in `pytest`).
