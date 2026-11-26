# Stakeholder Questions & Unresolved Requirements (Phase 0A Governance)

> [!NOTE]
> Unresolved clinical, legal, and billing policy questions must **never** be hardcoded into application logic. Each question is assigned a responsible stakeholder, target phase, and implementation gate.

| ID | Category | Question for Hospital Stakeholders | Responsible Stakeholder | Target Phase | Implementation Gate |
|---|---|---|---|---|---|
| SQ-01 | Billing | How is IPD room rent calculated (24-hour cycle from admission vs calendar-day cutoff e.g. 12:00 PM / midnight)? | Hospital Administrator & Accounts Lead | Phase 6 (Tariff rule) | Must be signed off before Phase 6 IPD rent accrual implementation |
| SQ-02 | Billing / Tax | Which services/medicines attract GST vs healthcare exemption under hospital's registration? | Chartered Accountant (CA) & Accounts Lead | Phase 4 / Phase 6 | Must be signed off before Phase 4 pharmacy & Phase 6 tax invoice posting |
| SQ-03 | Visiting Doctors | What exact fee-sharing / per-visit / percentage settlement models are contracted? | Hospital Owner & Medical Superintendent | Phase 1 (Contract schema) / Phase 6 (Settlements) | Contract model configurable in Phase 1; payout formulas gated on Phase 6 sign-off |
| SQ-04 | External Labs | Do external collectors need a portal login or coordinator-mediated handoff only? | Laboratory Coordinator & Hospital Admin | Phase 5 | Must be signed off before Phase 5 collector auth/handoff implementation |
| SQ-05 | Discharge | Should bed cleaning be mandatory (`CLEANING` → `AVAILABLE`) before next admission? | Nursing Superintendent & Hospital Admin | Phase 3 | Configurable hospital setting in Phase 3; default `CLEANING` transition recommended |
| SQ-06 | Scope Exclusions | Confirm that ABDM, TPA/insurance, WhatsApp, and OT/ICU integrations remain out of MVP. | Hospital Owner & Technical PM | Phase 1 Entry | Confirm before Phase 1 kickoff to prevent scope creep |
