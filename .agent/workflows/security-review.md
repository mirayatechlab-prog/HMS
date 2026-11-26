---
description: Security, tenant isolation, and privacy review workflow
---
# Security Review Workflow
1. Verify no secrets or `.env` files are committed and no real PHI/PII exists in fixtures or artifacts.
2. Verify tenant isolation: `hospital_id` on tenant tables, RLS policies, restricted `medicore_app` DB role, no client-trusted `hospital_id`.
3. Check auth/RBAC, input validation, CORS, CSP headers, and private S3 object storage controls.
4. Audit logging: ensure actor/action/entity/timestamp/tenant are logged without secrets or raw PHI.
