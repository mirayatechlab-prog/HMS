# Architecture Decision Records (ADRs)

| ADR | Decision | Rationale | Status |
|---|---|---|---|
| ADR-001 | Modular Monolith over Microservices | ACID transactions across bed allocation, pharmacy stock, and billing without distributed saga complexity. | Accepted |
| ADR-002 | PostgreSQL 16 + RLS + Separate Roles | `medicore_app` (non-superuser, RLS enforced) vs `medicore_migrator` (DDL only) provides defense-in-depth tenant isolation. | Accepted |
| ADR-003 | UUID Internal IDs + Human-Readable Codes | Internal `UUID` PKs prevent enumeration; `UHID`, admission #, and invoice # are tenant-scoped sequences. | Accepted |
| ADR-004 | Fixed-Precision `NUMERIC(14,2)` / `Decimal` | Eliminates IEEE-754 floating-point rounding drift in INR billing and settlements. | Accepted |
| ADR-005 | Zero Hardcoded Capacity / Derived Bed Counts | Capacity metrics computed strictly from `beds` records; supports 0 to 500+ beds seamlessly. | Accepted |
| ADR-006 | SeaweedFS (S3) for Local Object Storage | Provides S3-compatible private bucket API locally on Apple Silicon (`arm64`) without proprietary registry auth. | Accepted |
| ADR-007 | Gated Phase 0 UI Previews | `VITE_ENABLE_PHASE0_PREVIEWS=false` excludes demo routes from production builds. | Accepted |
