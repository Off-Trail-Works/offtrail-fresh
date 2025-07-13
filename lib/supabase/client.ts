import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

export function createClient() {
  const config = getSupabaseConfig();
  console.log('🔧 Supabase config:', { url: config.url, anonKey: config.anonKey.slice(0, 20) + '...' });
  return createBrowserClient(config.url, config.anonKey);
}
