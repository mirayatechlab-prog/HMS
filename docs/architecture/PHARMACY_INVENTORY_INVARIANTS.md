# Pharmacy Inventory Invariants

1. **Transactional Stock Ledger**: All stock changes (purchase receipts, OPD/IPD dispensing, partial dispensing, patient/supplier returns, damage, expiry quarantine, adjustments) append to `stock_movement_ledger` inside a database transaction.
2. **No Unauthorized Negative Stock**: Batch quantities are locked (`SELECT ... FOR UPDATE`) during dispensing and constrained `quantity_on_hand >= 0`.
3. **FEFO Dispensing**: First-Expired-First-Out batch selection is enforced by default.
4. **Expired & Quarantined Blocking**: Batches with `expiry_date < CURRENT_DATE` or `status IN ('EXPIRED', 'QUARANTINED')` are strictly blocked from dispensing.
5. **Unit Conversions & Restricted Records**: Accurate pack-to-unit conversion factors and dedicated register logging for Schedule H/H1/X restricted medicines.
