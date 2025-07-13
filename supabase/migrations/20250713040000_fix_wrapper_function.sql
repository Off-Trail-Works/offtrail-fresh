CREATE OR REPLACE FUNCTION public.trigger_advisor_creation()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  edge_function_url text := 'http://127.0.0.1:54321/functions/v1/create-test-advisor';
  service_key text;
BEGIN
  -- Get the service key from vault
  SELECT decrypted_secret INTO service_key
  FROM vault.decrypted_secrets
  WHERE name = 'supabase_service_role_key';

  -- Make HTTP request to Edge Function (no auth header needed for internal calls)
  PERFORM net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := '{}'::jsonb
  );

  RETURN 'Edge function triggered successfully.';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error triggering advisor creation: %', SQLERRM;
    RAISE;
END;
$$;
