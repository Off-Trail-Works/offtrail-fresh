import { createClient } from '@supabase/supabase-js'

interface Database {
  public: {
    Tables: {
      firms: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
      }
      advisors: {
        Row: {
          id: string
          firm_id: string
          email: string
          first_name: string
          last_name: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          firm_id: string
          email: string
          first_name: string
          last_name: string
          role?: string
        }
      }
      contacts: {
        Row: {
          id: string
          firm_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          status: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  // Force cache bust - v2
  try {
    // Debug: log environment variables
    console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL'))
    console.log('SUPABASE_SERVICE_ROLE_KEY:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    console.log('SUPABASE_ANON_KEY:', Deno.env.get('SUPABASE_ANON_KEY'))
    
    // Use local Supabase for development, environment variables for production
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? 'http://127.0.0.1:54321'
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
    
    console.log('Using URL:', supabaseUrl)
    console.log('Using Service Key:', supabaseServiceKey.substring(0, 20) + '...')
    
    // Initialize Supabase client with service role key (bypasses RLS)
    const supabaseClient = createClient<Database>(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )


   console.log('Finding firm with most contacts...')

    // Find firm with most contacts
    const { data: firms, error: firmsError } = await supabaseClient
      .from('firms')
      .select(`
        id,
        name,
        slug,
        contacts(count)
      `)

    if (firmsError) {
      console.error('Error fetching firms:', firmsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch firms', details: firmsError }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=0, must-revalidate'
          }
        }
      )
    }

    if (!firms || firms.length === 0) {
      console.log('No firms found')
      return new Response(
        JSON.stringify({ error: 'No firms found in database' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=0, must-revalidate'
          }
        }
      )
    }

    // Find firm with most contacts
    const firmWithMostContacts = firms.reduce((max, firm) => {
      const contactCount = firm.contacts?.[0]?.count || 0
      const maxContactCount = max.contacts?.[0]?.count || 0
      return contactCount > maxContactCount ? firm : max
    })

    console.log(`Found firm: ${firmWithMostContacts.name} (${firmWithMostContacts.contacts?.[0]?.count || 0} contacts)`)

    // Create test advisor
    const testEmail = 'test@example.com'
    const testPassword = 'password123'

    console.log(`Creating test advisor for firm: ${firmWithMostContacts.name}`)

    // Check if test advisor already exists
    const { data: existingAdvisor } = await supabaseClient
      .from('advisors')
      .select('id, email')
      .eq('email', testEmail)
      .single()

    if (existingAdvisor) {
      console.log('Test advisor already exists')
      return new Response(
        JSON.stringify({
          message: 'Test advisor already exists',
          email: testEmail,
          password: testPassword,
          firm: firmWithMostContacts.name,
          advisorId: existingAdvisor.id
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=0, must-revalidate'
          }
        }
      )
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return new Response(
        JSON.stringify({ error: 'Failed to create auth user', details: authError }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=0, must-revalidate'
          }
        }
      )
    }

    console.log(`Created auth user with ID: ${authData.user.id}`)

    // Create advisor record
    const { data: advisor, error: advisorError } = await supabaseClient
      .from('advisors')
      .insert({
        id: authData.user.id,
        firm_id: firmWithMostContacts.id,
        email: testEmail,
        first_name: 'Test',
        last_name: 'Advisor',
        role: 'advisor'
      })
      .select()
      .single()

    if (advisorError) {
      console.error('Error creating advisor record:', advisorError)
      // Clean up auth user if advisor creation failed
      await supabaseClient.auth.admin.deleteUser(authData.user.id)
      return new Response(
        JSON.stringify({ error: 'Failed to create advisor record', details: advisorError }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=0, must-revalidate'
          }
        }
      )
    }

    console.log('✅ Test advisor created successfully!')

    const result = {
      message: 'Test advisor created successfully!',
      email: testEmail,
      password: testPassword,
      firm: firmWithMostContacts.name,
      advisorId: advisor.id,
      instructions: 'You can now login at /auth/login with the provided credentials'
    }

    console.log('Result:', result)

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=0, must-revalidate'
        }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Unexpected error occurred', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=0, must-revalidate'
        }
      }
    )
  }
})
