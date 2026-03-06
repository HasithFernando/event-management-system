-- Initialize database schemas for Event Management System
-- This script runs automatically when PostgreSQL container starts

-- Create schemas for each microservice
CREATE SCHEMA IF NOT EXISTS auth_schema;
CREATE SCHEMA IF NOT EXISTS event_schema;
CREATE SCHEMA IF NOT EXISTS ticket_schema;
CREATE SCHEMA IF NOT EXISTS notification_schema;
CREATE SCHEMA IF NOT EXISTS analytics_schema;
CREATE SCHEMA IF NOT EXISTS profile_schema;
CREATE SCHEMA IF NOT EXISTS review_schema;

-- Grant all privileges to postgres user (already the owner, but explicit is good)
GRANT ALL PRIVILEGES ON SCHEMA auth_schema TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA event_schema TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA ticket_schema TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA notification_schema TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA analytics_schema TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA profile_schema TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA review_schema TO postgres;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA auth_schema GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA event_schema GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA ticket_schema GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA notification_schema GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics_schema GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA profile_schema GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA review_schema GRANT ALL ON TABLES TO postgres;
