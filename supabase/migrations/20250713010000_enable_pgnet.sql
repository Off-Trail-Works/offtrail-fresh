-- Enable pg_net extension for HTTP requests from database
-- This must run before any migrations that use net.http_post()

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;