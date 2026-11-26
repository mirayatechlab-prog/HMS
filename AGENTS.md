# MediCore HMS — Repository Engineering Contract (`AGENTS.md`)

This document is the binding engineering contract for all human engineers and AI agents working on **MediCore HMS**.

## 1. Architecture Consistency
- MediCore HMS is a **modular monolith** (FastAPI + SQLAlchemy 2 + PostgreSQL + Redis + React/TypeScript).
- Do NOT introduce microservices, Kubernetes, Kafka/event-streaming platforms, or unnecessary distributed infrastructure during the MVP.
- All API routes must be versioned under `/api/v1`.
- Use standardized error envelopes (`code`, `message`, `correlation_id`, `details`) and propagate `X-Correlation-ID` across requests and logs.

## 2. Module Ownership
- Backend domain modules live under `backend/app/modules/<domain>/`.
- Modules must communicate through explicit service interfaces/contracts, never by reaching into another module's private ORM tables without an approved contract.
- Frontend feature modules live under `frontend/src/features/<domain>/`, sharing UI primitives from `frontend/src/components/`.

## 3. Type Safety
- **Backend**: Python 3.13+, Pydantic v2, SQLAlchemy 2 typed mappings, `mypy` strictness on core/module interfaces, `ruff` for linting and formatting.
- **Frontend**: TypeScript with `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`. Avoid `any`; use Zod schemas for runtime validation at boundaries.

## 4. Dynamic Capacity & Tenant Isolation (Non-Negotiable)
- **Never hardcode** the number of beds, rooms, wards, floors, buildings, room categories, doctors, staff, reception counters, pharmacies, laboratories, collectors, services, or tariffs.
- The system must function cleanly with **0 configured beds** (initial onboarding) and scale to **5, 30, 100, 500+** beds without code changes.
- **Never** use an independently editable `total_beds` column as the source of truth; capacity is always derived from individual `beds` records.
- Every tenant-owned domain table must carry `hospital_id` (UUID, non-null) with tenant-scoped unique constraints and PostgreSQL Row-Level Security (RLS) defense in depth.
- **Never** trust client-supplied `hospital_id` for authorization; derive tenant context from authenticated session/claims and bind it per transaction.

## 5. Clinical Safety
- Separate permanent patient identity (`uhid`) from individual visits (`opd_encounters`) and admissions (`ipd_admissions`).
- Clinical notes, vitals, and lab results must use **append-only amendments** rather than silent overwrites.
- Medication ordering, pharmacy dispensing, and nursing administration (MAR) are distinct auditable events.
- Patient care and clinical discharge must **never** be blocked by billing clearance; clinical discharge, financial clearance, and physical bed release are separate events.
- Never allow dispensing expired or quarantined pharmacy batches.
- Never use real patient data (PHI/PII) in development, test fixtures, screenshots, or agent artifacts.

## 6. Financial Accuracy
- Use fixed-precision `DECIMAL` / `NUMERIC(14, 2)` in PostgreSQL and `Decimal` in Python for all monetary values. **Never** use `float` or IEEE-754 floating point for currency.
- Posted invoices, receipts, and ledger entries are **immutable**; corrections require authorized credit notes, adjustments, or controlled reversals.
- Separate deposits, receipts, charges, and recognized revenue.
- Financial mutations must be **idempotent** and preserve effective-dated historical tariffs.

## 7. Database Migrations
- All schema changes must go through Alembic (`backend/alembic/`).
- Migrations run under the privileged `medicore_migrator` role; runtime application queries run under the restricted `medicore_app` role (no DDL, subject to RLS).
- Never run destructive database resets without explicit human confirmation.

## 8. API Contracts
- OpenAPI schemas must accurately reflect request/response models.
- Public health endpoints (`/api/v1/health/live`, `/api/v1/health/ready`) must never expose database credentials, connection strings, or internal stack traces.

## 9. UI Consistency & Accessibility
- Follow the MediCore Healthcare SaaS Design System (`docs/product/UI_UX_DESIGN_SYSTEM.md`): white/soft-gray surfaces, deep navy typography, teal primary accent, semantic status tokens.
- Target **WCAG 2.2 AA** contrast, full keyboard navigation, and visible focus rings.
- **Never** communicate clinical or financial status through color alone; always pair color with text labels and/or icons.
- Phase 0 demonstration previews must be clearly labeled as demonstrations and gated behind `VITE_ENABLE_PHASE0_PREVIEWS` so they are excluded from production builds by default.

## 10. Testing & Verification
- Every phase requires automated backend (`pytest`), frontend (`vitest`, `tsc`, `eslint`), migration, and UI verification.
- Never fabricate test results or claim verification that was not executed. Distinguish clearly between *implemented and verified*, *implemented but not verified*, *designed only*, *deferred*, and *blocked*.

## 11. Security & Privacy
- Never commit secrets, `.env` files, or credentials.
- Audit logs must capture `actor`, `action`, `entity`, `timestamp`, `hospital_id`, and safe change metadata—never passwords, tokens, or unnecessary raw clinical payloads.

## 12. Phase Boundaries & Mandatory Acceptance Reports
- Do not implement future-phase business modules ahead of phase approval.
- Every phase concludes with mandatory verification reports under `docs/reports/phase-<N>/` and an explicit Gate-based Acceptance Decision (`PASS`, `CONDITIONAL PASS`, `FAIL`, or `BLOCKED`).
- Never bypass phase acceptance merely because a build succeeds.
