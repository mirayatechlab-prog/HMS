# Phase 0 Financial Invariants Review

- **Designed only (Phase 5 Implementation)**:
  - Fixed-precision `NUMERIC(14, 2)` / `Decimal` currency (INR); `float` prohibited.
  - Immutable posted invoices, receipts, and ledger entries; reversals/credit notes only.
  - Separated deposits, receipts, accrued charges, and recognized revenue; idempotency keys required.
  - Effective-dated tariffs preserving historical charges.
- **Open Stakeholder Dependencies**: Room rent cutoff rules (`SQ-01`), GST applicability (`SQ-02`), and visiting doctor settlement formulas (`SQ-03`) flagged in `docs/product/STAKEHOLDER_QUESTIONS.md`.
