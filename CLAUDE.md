# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with turbopack (http://localhost:3000)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

For local development:
- `vercel env pull .env.local` - Pull environment variables from Vercel
- No test framework is currently configured

## Critical Supabase Development Workflow

**MANDATORY before every commit that includes database changes:**

1. **Make changes** - Edit functions, SQL files, etc.
2. **Create migration** - `supabase migration new your_change_description`
3. **Reset and rebuild** - `supabase db reset` (destroys local DB, rebuilds from scratch)
4. **Test locally** - `supabase functions serve` and test everything
5. **Only then commit** - If reset passes and tests work locally

The `supabase db reset` step is critical because it simulates exactly what happens when Vercel creates a fresh preview branch database. Any migration errors will be caught locally instead of breaking the deployment.

## Architecture Overview

This is an OffTrail CRM built as a Next.js 15 application with Supabase integration using Vercel's marketplace integration.

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Theme**: next-themes for dark/light mode
- **Deployment**: Vercel with automatic Supabase integration

### Database Schema
Multi-tenant architecture with Row Level Security (RLS):
- **firms**: Organizations that contain advisors and contacts
- **advisors**: Users linked to Supabase Auth (`id` matches `auth.uid()`), belong to one firm
- **contacts**: Customer data, scoped by firm via RLS policies

### Key Patterns

**Supabase Clients**:
- Server components: Use `lib/supabase/server.ts` with cookie-based auth
- Client components: Use `lib/supabase/client.ts` for browser client
- All clients use SSR-compatible `@supabase/ssr` package

**Authentication Flow**:
- Cookie-based sessions work across Server/Client Components, Route Handlers, and Middleware
- Auth pages in `app/auth/` directory (login, sign-up, forgot-password, etc.)
- Protected routes use middleware for authentication checks

**Data Access**:
- All database queries automatically respect RLS policies
- Advisors can only access data from their firm
- No manual tenant filtering required in application code

### Project Structure
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable UI components (including shadcn/ui components in `ui/`)
- `lib/` - Utility functions and Supabase client configurations
- `supabase/migrations/` - Database schema and RLS policies

### Environment Setup
Environment variables are auto-configured via Vercel's Supabase marketplace integration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Special Routes
- `/create-advisor` - Creates advisor accounts linked to existing firms (for testing)
- `/contacts` - Main CRM interface (requires advisor authentication)
- `/api/create-advisor` - API endpoint for advisor creation

### Migration Strategy
Database migrations in `supabase/migrations/` run automatically through Vercel's Supabase integration. No custom migration scripts needed.