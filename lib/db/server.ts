import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

function getDatabaseUrl() {
  // Always use local for now, we can make this smarter later
  return 'postgresql://postgres:postgres@localhost:54322/postgres';
}

// Create connection - only for server-side usage
const connectionString = getDatabaseUrl();

if (!connectionString) {
  throw new Error('Database connection string not found');
}

// Create postgres client
const client = postgres(connectionString, {
  prepare: false, // Required for Edge Functions
});

// Create Drizzle instance - server-side only
export const db = drizzle(client, { schema });

// Export schema for use in queries
export { schema };