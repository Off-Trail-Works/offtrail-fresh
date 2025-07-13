export type AppEnvironment = 'local' | 'development' | 'staging' | 'production';

export function detectEnvironment(): AppEnvironment {
  console.log('🌍 Environment detection:', {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    port: typeof window !== 'undefined' ? window.location.port : 'server'
  });

  // Check for explicit app environment setting first
  if (process.env.NEXT_PUBLIC_APP_ENV) {
    console.log('✅ Using explicit APP_ENV:', process.env.NEXT_PUBLIC_APP_ENV);
    return process.env.NEXT_PUBLIC_APP_ENV as AppEnvironment;
  }
  
  // Check for Vercel environment (reliable on Vercel)
  if (process.env.VERCEL_ENV === 'production') return 'production';
  if (process.env.VERCEL_ENV === 'preview') return 'staging';
  if (process.env.VERCEL_ENV === 'development') return 'development';
  
  // Server-side: NODE_ENV is reliable here
  if (typeof window === 'undefined') {
    // During `next dev`, NODE_ENV is 'development'
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Server-side detected local development');
      return 'local';
    }
    return process.env.NODE_ENV === 'production' ? 'production' : 'development';
  }
  
  // Client-side: Check hostname for local development
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  if (['localhost', '127.0.0.1', ''].includes(hostname) || port === '3000') {
    console.log('✅ Client-side detected local development via hostname/port');
    return 'local';
  }
  
  // Check for local Supabase URL as additional indicator
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('127.0.0.1') || 
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost')) {
    console.log('✅ Client-side detected local development via Supabase URL');
    return 'local';
  }
  
  // Default fallback
  console.log('⚠️ Falling back to production environment');
  return 'production';
}

export const isLocal = () => detectEnvironment() === 'local';
export const isDevelopment = () => ['local', 'development'].includes(detectEnvironment());
export const isProduction = () => detectEnvironment() === 'production';