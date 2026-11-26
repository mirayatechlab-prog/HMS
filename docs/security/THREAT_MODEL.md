# MediCore HMS — Threat Model (STRIDE)

| Threat Scenario | Affected Assets | Mitigations (Phase 0 / Phase 1+) |
|---|---|---|
| Cross-tenant data exposure | Patient/Billing/Audit records | Server-derived `hospital_id`, service filtering, `medicore_app` non-superuser role, PostgreSQL RLS |
| Unauthorized medical-record access | Clinical notes, lab reports | RBAC + encounter-scoped visiting doctor checks + emergency break-glass audit |
| Stolen credentials / Session hijacking | User accounts, JWT/refresh | Argon2id, MFA for privileged roles, 15-min access tokens, refresh rotation + Redis revocation |
| Financial manipulation | Invoices, receipts, cash drawer | `Decimal` precision, immutable posted ledgers, authorized reversals, idempotency keys |
| Inventory manipulation | Pharmacy stock & Schedule H | Transactional ledger, `FOR UPDATE` locking, expiry/quarantine blocks, audit trail |
| Malicious file uploads | Lab report PDFs | Content-type + magic-byte validation, size limits, private S3 bucket, no inline HTML/JS serving |
| SQL injection / XSS | API & React SPA | SQLAlchemy parameterized queries, Pydantic v2 validation, React auto-escaping, CSP |
| Ransomware / Accidental deletion / DB corruption | PostgreSQL & S3 backups | Automated encrypted off-site backups, immutable backup retention, periodic restore drills |
