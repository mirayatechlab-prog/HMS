# Phase 0 Database Design Report

## 1. Conceptual & Logical Design
- **Status**: **Designed only** for M01–M16 domain entities (`docs/architecture/DATABASE_DOMAIN_MODEL.md`, `ER_DIAGRAM.md`).
- **Implemented and verified in Phase 0**:
  - `hospitals` table (UUID PK, tenant code unique index, timezone `Asia/Kolkata`, currency `INR`, locale `en-IN`, fiscal year start month; **no `total_beds` column**).
  - `audit_logs` table (UUID PK, nullable `hospital_id` FK, actor/action/entity/correlation_id/metadata, timezone-aware `created_at`) with PostgreSQL Row-Level Security (`audit_logs_tenant_isolation`) enabled (`rowsecurity = t`).
  - Role separation: `medicore_migrator` (migrations/DDL) vs `medicore_app` (restricted runtime role, `infrastructure/postgres/init-roles.sql`).
