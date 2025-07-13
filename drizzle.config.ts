import { defineConfig } from 'drizzle-kit';

function getDatabaseUrl() {
  // Always use local for development
  return 'postgresql://postgres:postgres@localhost:54322/postgres';
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/db/schema.ts',
  out: './supabase/migrations',
  dbCredentials: {
    url: getDatabaseUrl()!,
  },
  verbose: true,
  strict: true,
  migrations: {
    prefix: 'timestamp',
  },
});