Deno.serve(async (req) => {
  console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL'))
  console.log('SUPABASE_SERVICE_ROLE_KEY:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
  console.log('SUPABASE_ANON_KEY:', Deno.env.get('SUPABASE_ANON_KEY'))
  
  return new Response(JSON.stringify({ 
    message: "Hello World",
    supabase_url: Deno.env.get('SUPABASE_URL'),
    has_service_key: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  }), {
    headers: { "Content-Type": "application/json" }
  })
})