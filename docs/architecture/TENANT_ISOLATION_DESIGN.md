# Tenant Isolation Design

## Defense-in-Depth Layers
1. **Authentication & Claims**: `hospital_id` derived strictly from verified server-side session/JWT claims—never trusted from client query/body parameters.
2. **Application Authorization**: Service layer filters every query and mutation by `hospital_id` and verifies cross-entity FK ownership within the same tenant.
3. **Database Role Separation**:
   - `medicore_migrator`: Owns schema and runs Alembic migrations.
   - `medicore_app`: Restricted runtime role (`NOSUPERUSER`, no DDL), subject to PostgreSQL RLS.
4. **PostgreSQL Row-Level Security (RLS)**:
   - Transaction-scoped context set via `SELECT set_config('app.current_hospital_id', :hospital_id, true)`.
   - Verified in Phase 0 on `audit_logs` (`audit_logs_tenant_isolation` policy).
5. **Phase 1+ Verification**: Automated cross-tenant read/write/FK isolation tests before any tenant-facing module ships.
