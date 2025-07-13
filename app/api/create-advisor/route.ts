import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  // Only allow in non-production environments
  if (process.env.VERCEL_ENV === 'production') {
    return Response.json(
      { error: 'Advisor creation not allowed in production' },
      { status: 403 }
    )
  }

  if (
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    return Response.json(
      { error: 'Missing Supabase environment variables' },
      { status: 500 }
    )
  }

  // Create admin client for user creation
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    const body = await request.json()
    const { email, firstName, lastName, password, firmId } = body

    if (!email || !firstName || !lastName || !password || !firmId) {
      return Response.json(
        { error: 'Missing required fields: email, firstName, lastName, password, firmId' },
        { status: 400 }
      )
    }

    // 1. Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    let userId: string
    if (authError?.message.includes('already been registered')) {
      // Get existing user
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingUser = users.users.find((u) => u.email === email)
      if (!existingUser) {
        return Response.json(
          { error: 'Could not find existing user' },
          { status: 500 }
        )
      }
      userId = existingUser.id
    } else if (authError) {
      return Response.json(
        { error: 'Failed to create auth user', details: authError.message },
        { status: 500 }
      )
    } else {
      userId = authUser.user.id
    }

    // 2. Verify firm exists
    const { data: firm, error: firmError } = await supabase
      .from('firms')
      .select('*')
      .eq('id', firmId)
      .single()

    if (firmError || !firm) {
      return Response.json(
        {
          error: 'Firm not found',
          details: 'Invalid firm ID provided',
          firmId: firmId
        },
        { status: 400 }
      )
    }
    
    // Check contact count for this firm
    const { data: contacts } = await supabase
      .from('contacts')
      .select('id')
      .eq('firm_id', firm.id)
      .limit(5)

    // 3. Create advisor record
    const advisorPayload = {
      id: userId,
      firm_id: firm.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role: 'advisor',
    }

    const { error: advisorError } = await supabase
      .from('advisors')
      .upsert(advisorPayload)
      .select()

    if (advisorError) {
      return Response.json(
        {
          error: 'Failed to create advisor',
          details: advisorError.message,
          code: advisorError.code,
          hint: advisorError.hint,
          userId: userId,
          firmId: firm.id,
          payload: advisorPayload
        },
        { status: 500 }
      )
    }

    // 4. Verify advisor was created
    const { data: createdAdvisor } = await supabase
      .from('advisors')
      .select('*')
      .eq('id', userId)
      .single()

    if (!createdAdvisor) {
      return Response.json(
        {
          error: 'Advisor creation failed - not found in database',
          userId: userId,
        },
        { status: 500 }
      )
    }

    return Response.json({
      success: 'Advisor created successfully!',
      credentials: { email, password },
      firm: {
        id: firm.id,
        name: firm.name,
        slug: firm.slug,
        contactCount: contacts?.length || 0
      },
      userId: userId,
      advisor: createdAdvisor,
      environment: {
        branch: process.env.VERCEL_GIT_COMMIT_REF || 'local',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
      nextSteps: [
        'You can now log in with these credentials',
        'Visit /contacts to see your firm\'s contacts',
        'Visit /auth/login to sign in'
      ]
    })
  } catch (error) {
    return Response.json(
      {
        error: 'Advisor creation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}