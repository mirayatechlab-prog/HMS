# Financial Invariants & Billing Integration Contracts

1. **Fixed-Precision Currency**: All monetary amounts use `NUMERIC(14, 2)` in PostgreSQL and `Decimal` in Python. Floating-point (`float`) is strictly prohibited.
2. **Immutable Posted History**: Posted invoices, receipts, and settlement vouchers are immutable. Cancellations and corrections occur only via authorized credit notes, adjustments, or controlled reversals.
3. **Separation of Accounting Concepts**: Advance deposits, payment receipts, accrued patient charges, and recognized revenue are tracked in distinct entities.
4. **Idempotent Processing**: Payment and settlement mutations require an `idempotency_key` scoped to `(hospital_id, endpoint)` to prevent duplicate charges/receipts.
5. **Effective-Dated Tariffs**: Changing a room, bed, or service tariff never alters previously posted historical charges.
6. **Configurable Numbering & Tax**: Tenant-scoped invoice prefixes, fiscal year start month, and tax flags (pending stakeholder confirmation SQ-01, SQ-02).
