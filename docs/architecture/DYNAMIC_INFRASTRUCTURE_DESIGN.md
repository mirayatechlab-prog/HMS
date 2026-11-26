# Dynamic Infrastructure & Bed Management Invariants

## Hierarchy
`Hospital → Building → Floor → Ward → Room → Bed` (with simplified single-building/single-floor onboarding supported).

## Mandatory Invariants & PostgreSQL Concurrency Controls
1. **No Overlapping Active Bed Assignments**: Enforced in Phase 3 via PostgreSQL `EXCLUDE USING gist (bed_id WITH =, tstzrange(started_at, COALESCE(ended_at, 'infinity')) WITH &&) WHERE (is_active = true)` and `SELECT ... FOR UPDATE` row locking during allocation/transfer.
2. **One Active Bed per Admission**: Partial unique index `UNIQUE (admission_id) WHERE (ended_at IS NULL AND is_active = true)`.
3. **Lifecycle Protection**: Occupied (`OCCUPIED`) and reserved (`RESERVED`) beds cannot be archived/deactivated (`is_active = false`). Inactive rooms/beds reject new admissions.
4. **Effective-Dated Tariffs**: `room_tariffs` and `bed_tariffs` carry `(effective_from, effective_to)`; historical accrued charges snapshot the tariff rate at posting time.
5. **Distinct Discharge Events**: Clinical discharge, financial clearance, and physical bed release (`OCCUPIED` → `CLEANING` → `AVAILABLE`) are separate auditable events.
6. **Derived Capacity**: Capacity metrics (`configured`, `active`, `available`, `occupied`, `reserved`, `cleaning`, `maintenance`, `blocked`, `inactive`) are always computed from `beds` rows—verified for 0, 5, 30, 100, and 500 beds.
