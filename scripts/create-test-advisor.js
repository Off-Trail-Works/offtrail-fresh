#!/usr/bin/env node

/**
 * Script to create a test advisor for the firm with the most contacts
 * Uses Supabase service role key to bypass RLS
 */

import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create admin client that bypasses RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function findFirmWithMostContacts() {
  console.log('Finding firm with most contacts...')
  
  const { data: firms, error } = await supabase
    .from('firms')
    .select(`
      id,
      name,
      slug,
      contacts(count)
    `)
  
  if (error) {
    console.error('Error fetching firms:', error)
    return null
  }

  if (!firms || firms.length === 0) {
    console.log('No firms found')
    return null
  }

  // Find firm with most contacts
  const firmWithMostContacts = firms.reduce((max, firm) => {
    const contactCount = firm.contacts?.[0]?.count || 0
    const maxContactCount = max.contacts?.[0]?.count || 0
    return contactCount > maxContactCount ? firm : max
  })

  console.log(`Found firm: ${firmWithMostContacts.name} (${firmWithMostContacts.contacts?.[0]?.count || 0} contacts)`)
  return firmWithMostContacts
}

async function createTestAdvisor(firmId, firmName) {
  console.log(`Creating test advisor for firm: ${firmName}`)
  
  const testEmail = 'test@example.com'
  const testPassword = 'password123'
  
  // First, create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true
  })

  if (authError) {
    console.error('Error creating auth user:', authError)
    return null
  }

  console.log(`Created auth user with ID: ${authData.user.id}`)

  // Then create the advisor record
  const { data: advisor, error: advisorError } = await supabase
    .from('advisors')
    .insert({
      id: authData.user.id, // Use the auth user ID
      firm_id: firmId,
      email: testEmail,
      first_name: 'Test',
      last_name: 'Advisor',
      role: 'advisor'
    })
    .select()
    .single()

  if (advisorError) {
    console.error('Error creating advisor record:', advisorError)
    // Clean up the auth user if advisor creation failed
    await supabase.auth.admin.deleteUser(authData.user.id)
    return null
  }

  console.log('✅ Test advisor created successfully!')
  console.log(`Email: ${testEmail}`)
  console.log(`Password: ${testPassword}`)
  console.log(`Advisor ID: ${advisor.id}`)
  console.log(`Firm: ${firmName}`)
  
  return advisor
}

async function main() {
  try {
    const firm = await findFirmWithMostContacts()
    if (!firm) {
      console.error('No firm found')
      process.exit(1)
    }

    const advisor = await createTestAdvisor(firm.id, firm.name)
    if (!advisor) {
      console.error('Failed to create advisor')
      process.exit(1)
    }

    console.log('\n🎉 Ready to test!')
    console.log('You can now login at /auth/login with:')
    console.log('Email: test@example.com')
    console.log('Password: password123')
    
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

main()