# MediCore HMS — Security Architecture

## 1. Authentication & Session Controls (Phase 1 Implementation)
- **Password Hashing**: Argon2id (`pwdlib` / `argon2-cffi`) with per-user salt.
- **Tokens**: Short-lived JWT access tokens (15 min) + opaque HTTP-only `Secure`, `SameSite=Lax` refresh tokens with rotation & reuse detection (revoked in Redis).
- **MFA**: TOTP MFA mandatory for `System Administrator`, `Hospital Administrator`, `Hospital Owner`, and `Accountant`.
- **CSRF & Rate Limiting**: Origin/CSRF validation on cookie-authenticated mutations; Redis-backed rate limiting on auth & sensitive endpoints.

## 2. Transport, Headers & Storage
- **HTTPS**: TLS 1.2+ termination in production reverse proxy; HSTS enabled.
- **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and strict CSP.
- **Private Object Storage**: Lab reports and documents stored in private S3-compatible buckets; access only via authorized short-lived presigned URLs (`S3ObjectStorageClient`).

## 3. Audit & Redaction
- `structlog` redacts `password`, `secret`, `token`, `authorization`, `cookie`, `api_key`, `database_url`.
- `audit_logs` captures `hospital_id`, `actor_id`, `actor_role`, `action`, `entity_type`, `entity_id`, `correlation_id`, `created_at`—never passwords or raw PHI.
