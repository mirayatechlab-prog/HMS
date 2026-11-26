# Database Domain Model

## 1. Core Design Conventions
- **Primary Keys**: `UUID` (`Uuid(as_uuid=True)`) on all entities; human-readable codes (`UHID`, admission #, invoice #) are separate tenant-scoped unique columns.
- **Tenant Ownership**: Every tenant-owned table includes `hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT`, indexed and protected by PostgreSQL RLS.
- **Tenant-Scoped Uniqueness**: `UNIQUE (hospital_id, code)` / `UNIQUE (hospital_id, uhid)` / `UNIQUE (hospital_id, invoice_number)`.
- **Financial Precision**: `NUMERIC(14, 2)` for all monetary amounts; `NUMERIC(10, 3)` for medication quantities.
- **Timestamps**: `TIMESTAMPTZ` (`DateTime(timezone=True)`) stored in UTC; displayed in `Asia/Kolkata` (or hospital timezone).
- **Lifecycle vs Operational Status**: `is_active` / `archived_at` separated from operational status enums (`AVAILABLE`, `OCCUPIED`, etc.).
- **Phase 0 Implemented Tables**: `hospitals`, `audit_logs` (with Alembic migration `20261127_0001`). All other domain tables are designed here for Phase 1–6 implementation.
