-- Enable supabase_vault extension for secure secret storage
-- This must run before any functions that use vault.get_secret()

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;