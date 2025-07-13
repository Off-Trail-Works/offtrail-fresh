-- Create wrapper function to trigger advisor creation
-- Makes internal HTTP request to Edge Function

CREATE OR REPLACE FUNCTION public.trigger_advisor_creation()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  -- Supabase internal URL to functions gateway (same for all projects)
  edge_function_url text := 'http://127.0.0.1:54321/functions/v1/create-test-advisor';
  
  response_body jsonb;
  response_status int;
BEGIN
  -- Make HTTP request to Edge Function using pg_net
  -- Internal requests within Supabase don't need explicit auth
  SELECT
    status_code,
    body
  INTO
    response_status,
    response_body
  FROM
    extensions.http_post(
      url := edge_function_url,
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := '{}'::jsonb
    );

  -- Log the response for debugging
  RAISE NOTICE 'Edge function response status: %, body: %', response_status, response_body;

  -- Return success message with response details
  RETURN format('Edge function triggered successfully (status: %s): %s', 
                response_status, 
                response_body::text);
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors and re-raise
    RAISE NOTICE 'Error triggering advisor creation: %', SQLERRM;
    RAISE;
END;
$$;