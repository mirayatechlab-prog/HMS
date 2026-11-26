-- Initialize restricted application role separate from privileged migrator role.
-- Executed once by PostgreSQL docker-entrypoint-initdb.d on fresh volume initialization.

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'medicore_app') THEN
        CREATE ROLE medicore_app LOGIN PASSWORD 'dev_app_password_change_me' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
    END IF;
END
$$;

-- Enable pgcrypto / uuid support if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant minimal connection & schema usage; table privileges are granted by Alembic migrations
GRANT CONNECT ON DATABASE medicore_hms TO medicore_app;
GRANT USAGE ON SCHEMA public TO medicore_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO medicore_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO medicore_app;
