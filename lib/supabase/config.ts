import { detectEnvironment } from '../env';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const env = detectEnvironment();
  
  // For local development, check if local env vars are set
  // If not set, assume user wants to use local Supabase CLI defaults
  if (env === 'local') {
    const localUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
    const localAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY;
    const localServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_LOCAL_SERVICE_ROLE_KEY;
    
    if (!localAnonKey) {
      throw new Error('Local development requires NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY to be set in your .env.local file');
    }
    
    return { 
      url: localUrl, 
      anonKey: localAnonKey,
      serviceRoleKey: localServiceKey
    };
  }
  
  // Remote environments - use environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !anonKey) {
    throw new Error(`Missing Supabase environment variables for ${env} environment. Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY`);
  }
  
  return { url, anonKey, serviceRoleKey };
}