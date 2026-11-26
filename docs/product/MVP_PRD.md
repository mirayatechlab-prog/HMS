# MediCore HMS — MVP Product Requirements Document (PRD)

## 1. Product Vision
MediCore HMS is a modern, secure, multi-tenant-ready, dynamically configurable Hospital Management System designed for small and medium-sized hospitals. The initial customer profile (~30 inpatient beds, general/semi-special/special rooms, 2 permanent doctors, visiting specialists, reception, nursing, 1 in-house pharmacy, external blood/urine collectors, external diagnostic labs, and admin/accounts) represents **initial deployment characteristics, not system limits**.

## 2. Non-Negotiable Core Principles
1. **Dynamic Configuration**: Zero hardcoded counts for beds, rooms, wards, floors, buildings, categories, doctors, staff, reception counters, pharmacies, labs, collectors, services, or tariffs. Zero-bed onboarding must work.
2. **Clinical Safety**: Permanent UHID separated from encounters/admissions; append-only clinical amendments; separated ordering/dispensing/administration; clinical care never blocked by billing clearance.
3. **Financial Accuracy**: Fixed-precision `DECIMAL(14,2)` currency (INR), immutable posted ledgers, idempotent transactions, separated deposits/charges/receipts/revenue.
4. **Multi-Tenant Foundation**: `hospital_id` isolation on all tenant records, tenant-scoped uniqueness and numbering, PostgreSQL RLS defense in depth.

## 3. Approved MVP Modules (M01–M17)
- **M01**: Authentication and access control (RBAC, MFA for privileged roles, refresh rotation).
- **M02**: Hospital onboarding and configuration (9-step wizard with draft save).
- **M03**: Hospital infrastructure management (Building → Floor → Ward → Room → Bed + categories + tariffs).
- **M04**: Staff and doctor management (Permanent & visiting doctors, schedules, contracts).
- **M05**: Patient registration and permanent UHID (Demographics, allergies, duplicate detection, controlled merge).
- **M06**: OPD appointments and queue management (Appointments, walk-ins, queues).
- **M07**: Doctor consultation and clinical records (Vitals, observations, diagnoses, Rx, lab requests, amendments).
- **M08**: IPD admission and bed allocation (Admissions, transfers, attendants, discharge/clearance/release).
- **M09**: Nursing station and medication administration (MAR, rounds, vitals, nursing observations).
- **M10**: Pharmacy and batch-based inventory (Batches, FEFO, expiry/quarantine blocking, ledger).
- **M11**: External laboratory and sample collection (Blood/urine catalogues, external collectors, external labs, private PDF reports).
- **M12**: Visiting doctor visits and settlements (Encounter-scoped access, contractual settlements).
- **M13**: Hospital billing and payments (OPD/IPD charges, advances, multi-mode payments, reversals).
- **M14**: Discharge management (Clinical discharge, summary, financial clearance, bed release/cleaning).
- **M15**: Basic expenses and financial operations (Expenses, daily cash reconciliation).
- **M16**: Dashboards and reports (Dynamic capacity, occupancy, collections, operational summaries).
- **M17**: Audit logging, security and backup management (Immutable audit trail, encrypted backups).

## 4. Explicit MVP Exclusions (Deferred Future Capabilities)
- Advanced operation theatre (OT) management
- ICU monitoring device integrations
- Automated clinical diagnosis or AI-generated treatment recommendations
- Automated insurance and TPA claims
- In-house laboratory analyzer integrations
- Patient mobile applications & external collector mobile applications
- Payroll management & full enterprise general ledger accounting
- ABDM integration, WhatsApp automation, online appointment marketplace
