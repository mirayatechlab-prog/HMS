# Phase 0A Stakeholder Dependency Register

Clinical, legal, and billing policy questions (`SQ-01`–`SQ-06`) were reviewed in Phase 0A. **No hospital answers were invented or hardcoded.**

| ID | Topic | Responsible Stakeholder | Target Phase | Implementation Gate |
|---|---|---|---|---|
| `SQ-01` | IPD room rent calculation cycle (24h vs calendar cutoff) | Hospital Administrator & Accounts Lead | Phase 6 | Signed off before Phase 6 IPD rent accrual logic |
| `SQ-02` | GST vs healthcare exemption rules on services/pharmacy | Chartered Accountant (CA) & Accounts Lead | Phase 4 / Phase 6 | Signed off before Phase 4 pharmacy & Phase 6 tax invoicing |
| `SQ-03` | Visiting doctor contractual fee-sharing / settlement formulas | Hospital Owner & Medical Superintendent | Phase 1 / Phase 6 | Configurable in Phase 1; payout formulas gated on Phase 6 |
| `SQ-04` | External collector portal login vs coordinator-mediated handoff | Laboratory Coordinator & Hospital Admin | Phase 5 | Signed off before Phase 5 collector workflow |
| `SQ-05` | Mandatory bed cleaning (`CLEANING` → `AVAILABLE`) policy | Nursing Superintendent & Hospital Admin | Phase 3 | Configurable hospital setting in Phase 3 |
| `SQ-06` | Confirmation of MVP exclusions (ABDM, TPA, WhatsApp, OT/ICU) | Hospital Owner & Technical PM | Phase 1 Entry | Confirmed before Phase 1 kickoff |
