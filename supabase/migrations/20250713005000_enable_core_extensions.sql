-- Enable core extensions required for the application
-- This ensures pg_net and vault are available in all environments

-- Enable the pg_net extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Enable the vault extension for secret management
CREATE EXTENSION IF NOT EXISTS vault WITH SCHEMA vault;