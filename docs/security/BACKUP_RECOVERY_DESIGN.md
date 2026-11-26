# Backup & Recovery Design

## 1. Objectives (Target RPO / RTO)
- **Target RPO**: ≤ 15 minutes (PostgreSQL WAL archiving / frequent encrypted snapshots) — subject to production hosting tier.
- **Target RTO**: ≤ 2 hours for full database + object storage restoration.

## 2. Backup Scope & Controls
- **PostgreSQL**: Daily full `pg_dump` (custom format) + continuous WAL archiving, encrypted at rest using KMS/age/AES-256 before off-site upload.
- **Private S3 Object Storage**: Bucket versioning enabled + cross-region/off-site encrypted replication for uploaded lab reports and clinical documents.
- **Restore Testing**: Monthly automated restore drill to an isolated staging database verifying schema integrity, row counts, and RLS policies.
- **Ransomware Resilience**: Immutable (Object Lock / WORM) backup retention for 30+ days; backup credentials isolated from runtime application role (`medicore_app`).
