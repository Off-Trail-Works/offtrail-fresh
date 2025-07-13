-- Fix wrapper function to use correct pg_net function name
-- Drop and recreate the function with net.http_post instead of extensions.http_post

DROP FUNCTION IF EXISTS public.trigger_advisor_creation();

CREATE OR REPLACE FUNCTION public.trigger_advisor_creation()
RETURNS text
LANGUAGE plpgsql
-- Run with the permissions of the function's owner (the postgres superuser)
SECURITY DEFINER AS $$
DECLARE
  -- This internal URL is static and works in all environments (local and deployed)
  edge_function_url text := 'http://127.0.0.1:54321/functions/v1/create-test-advisor';

BEGIN
  -- Dynamically and securely get the service key for the CURRENT environment from the Vault
  service_key := vault.get_secret('supabase_service_role_key');

  -- Perform the authenticated HTTP request
  PERFORM net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := '{}'::jsonb
    );

  RETURN 'Edge function triggered successfully.';
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors and re-raise
    RAISE NOTICE 'Error triggering advisor creation: %', SQLERRM;
    RAISE;
END;
$$;
