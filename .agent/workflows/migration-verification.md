---
description: Alembic database migration verification workflow
---
# Migration Verification Workflow
1. Confirm migrations run with `DATABASE_MIGRATION_URL` (`medicore_migrator` role), not `medicore_app`.
2. Run `alembic upgrade head` on a clean database and verify schema, indexes, constraints, and RLS policies.
3. Verify `alembic check` reports no pending model-schema drift.
4. Never run destructive resets without explicit user confirmation.
