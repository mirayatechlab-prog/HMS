---
trigger: always_on
---

# MediCore HMS — Persistent Engineering Rules

Always enforce [`AGENTS.md`](../../AGENTS.md):
1. **Modular Monolith**: Keep domain boundaries under `backend/app/modules/` and `frontend/src/features/`. Never introduce microservices or event-streaming platforms in MVP.
2. **Dynamic Configuration**: Never hardcode bed counts, room counts, wards, doctors, staff, pharmacies, labs, or tariffs. Zero-bed onboarding must always work.
3. **Tenant Isolation**: Every tenant table requires `hospital_id` (UUID), tenant-scoped uniqueness, application authorization, and PostgreSQL RLS defense in depth. Never trust client-supplied `hospital_id`.
4. **Clinical & Financial Safety**: Separate permanent patient identity (`uhid`) from visits/admissions; use append-only clinical amendments; use `Decimal` (`NUMERIC(14,2)`) for money; never block clinical care on billing clearance.
5. **UI & Accessibility**: Target WCAG 2.2 AA, never rely on color alone for status, gate Phase 0 previews out of production builds.
6. **Verification Integrity**: Never fabricate test results or bypass phase acceptance gates.
