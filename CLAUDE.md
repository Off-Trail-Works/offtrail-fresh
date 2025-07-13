# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OffTrail Wealth Management Platform** - A modern, professional wealth management and client relationship management platform built with Next.js 15, Supabase, and Drizzle ORM.

### Current Architecture Status
- **Migration Status**: Migrated from manual SQL to Drizzle ORM for type safety and modern patterns
- **Design System**: Complete overhaul to modern financial app styling (completed)
- **Routing**: Simplified to focus on `/contacts` as the primary interface
- **Authentication**: Cookie-based Supabase Auth with `/contacts` as default destination

## Development Commands

### Core Development
- `npm run dev` - Start development server with turbopack (http://localhost:3000)
- `npm run dev:check` - Dev server + TypeScript checking + linting (recommended)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run typecheck` - Run TypeScript type checking only

### Database Management (Drizzle)
- `npm run db:generate` - Generate Drizzle migrations (use `--name` flag for custom names)
- `npm run db:migrate` - Run migrations against database
- `npm run db:push` - Push schema changes directly (development only)
- `npm run db:studio` - Open Drizzle Studio for database exploration
- `npm run db:seed` - Seed database with test data (28 contacts across 3 firms)

### Testing & Utilities
- `npm run create-test-advisor` - Create test advisor for branch deployments

## Database Architecture

### Current Schema (Drizzle)
**Database Location**: `lib/db/schema.ts` - Complete Drizzle schema with RLS policies

**Core Tables**:
1. **firms** - Organizations (3 test firms seeded)
   - `id` (UUID PK), `name`, `slug`, timestamps

2. **advisors** - Users linked to Supabase Auth
   - `id` (UUID PK, maps to auth.uid()), `firm_id`, `email`, `first_name`, `last_name`, `role`

3. **contacts** - Client data (28 total seeded)
   - `id` (UUID PK), `firm_id`, `first_name`, `last_name`, `email`, `phone`, `status`

**Test Data Distribution**:
- Wealth Management Partners: 15 contacts (primary test firm)
- Investment Solutions LLC: 8 contacts
- Financial Planning Group: 5 contacts

### Row-Level Security (RLS)
All tables have RLS policies defined in Drizzle schema:
- **Firms**: `id IN (SELECT firm_id FROM advisors WHERE id = auth.uid())`
- **Advisors**: Can view own record + same firm colleagues
- **Contacts**: `firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid())`

### Database Client Architecture
- **Server-only**: `lib/db/server.ts` - Drizzle connection with full schema
- **Client-safe**: `lib/db/client.ts` - Type exports only, safe for browser
- **Server Actions**: `app/actions/contacts.ts` - Proper client/server separation

## Design System

### Financial App Color Palette
```css
financial-blue: #1A5276     /* Primary trust color */
financial-green: #27AE60    /* Success/growth */
financial-red: #E74C3C      /* Danger/losses */
financial-amber: #F39C12    /* Warnings */
financial-gray: (50-900)    /* Neutral scale */
```

### Typography & Layout
- **Font**: Inter font family (professional, modern)
- **Shadows**: `shadow-financial`, `shadow-financial-lg`, `shadow-financial-xl`
- **Cards**: Rounded-xl, shadow-financial, border-financial-gray-200
- **Forms**: Icon-enhanced inputs, professional focus states

### Component Patterns
- **Stats Cards**: Icon + value + label pattern for KPIs
- **Status Badges**: Color-coded with dot indicators
- **Avatar Circles**: Gradient backgrounds with initials
- **Tables**: Desktop view with mobile card fallback
- **Professional Error States**: Consistent red accent styling

## Current Application Structure

### Route Mapping
- `/` → Redirects to `/contacts` (root redirect)
- `/contacts` → Main client portfolio interface (primary app)
- `/auth/login` → Modern financial app styled login form
- `/create-advisor` → Advisor registration/onboarding
- **Removed**: `/protected`, unused auth pages, dashboard placeholders

### Navigation Structure
**Sidebar Navigation**:
- Primary: "Clients" → `/contacts`
- Secondary: "Add Client" → `/create-advisor`
- **Removed**: Dashboard, Portfolio, Analytics, Reports, Calendar (not implemented)

### Component Architecture
- **Header**: `components/header.tsx` - Modern financial styling, notifications, user menu
- **Sidebar**: `components/sidebar.tsx` - Simplified navigation, performance card
- **Login Form**: `components/login-form.tsx` - Complete redesign with financial app patterns
- **Contacts Page**: `app/contacts/page.tsx` - Professional dashboard with stats, search, responsive design

## Authentication & Routing

### Authentication Flow
1. **Login**: `/auth/login` → `/` (redirects to `/contacts`)
2. **Logout**: Redirect to `/auth/login`
3. **Middleware**: Protects all routes except `/`, `/auth/*`, `/create-advisor`
4. **Session**: Cookie-based, works across all Next.js contexts

### Supabase Clients
- **Server Components**: `lib/supabase/server.ts`
- **Client Components**: `lib/supabase/client.ts`
- **Server Actions**: Use server-side client for security

## Critical Development Patterns

### Client/Server Separation
**IMPORTANT**: Never call Drizzle directly from client components
- ✅ **Correct**: Client → Server Action → Drizzle
- ❌ **Wrong**: Client Component → Drizzle directly

Example pattern:
```typescript
// app/actions/contacts.ts (Server Action)
export async function getContactsData() {
  const db = await getDb(); // Server-side only
  return await db.select().from(contacts);
}

// Client component
const { data } = await getContactsData(); // Safe
```

### File Organization
- **Server Actions**: `app/actions/` - Database operations
- **Database Layer**: `lib/db/` - Schema and connections
- **UI Components**: `components/` - Reusable interface elements
- **Supabase**: `lib/supabase/` - Auth and client configuration

### Styling Conventions
- **Always use**: `financial-*` color classes for consistency
- **Cards**: `bg-white rounded-xl shadow-financial border border-financial-gray-200`
- **Buttons**: `bg-financial-blue-600 hover:bg-financial-blue-700`
- **Form Inputs**: `border-financial-gray-300 focus:ring-financial-blue-500`
- **Status Colors**: Green (active), Blue (prospect), Amber (inactive), Gray (former)

## Deployment & Environment

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=     # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Public anon key
SUPABASE_SERVICE_ROLE_KEY=    # Admin key for server actions
DATABASE_URL=                 # Direct PostgreSQL connection for Drizzle
```

### Database Seeding
Two approaches available:
1. **Drizzle**: `npm run db:seed` (recommended for development)
2. **Supabase**: Use `supabase/seed.sql` for hosted databases

### Branch Deployments
- Automatic test advisor creation via Edge Functions
- Uses vault-based secret management for security
- Admin override key bypasses RLS for testing

## Common Patterns & Solutions

### TypeScript & Linting
- Run `npm run dev:check` for development with live type checking
- Always fix TypeScript errors before committing
- Remove unused imports/variables to prevent build failures

### Database Operations
- **Read Operations**: Use Server Actions for client components
- **Schema Changes**: Generate migrations with descriptive names
- **Testing**: Use seed data for consistent testing environment

### UI/UX Standards
- **Loading States**: Use financial color scheme with pulse animations
- **Error States**: Red accent colors with clear messaging
- **Empty States**: Professional messaging with call-to-action buttons
- **Responsive Design**: Desktop table + mobile card patterns

### Security Best Practices
- **RLS First**: Database security through RLS policies
- **Server Actions**: Keep sensitive operations server-side
- **Type Safety**: Leverage Drizzle's type system
- **Authentication**: Cookie-based sessions, protected routes

## Troubleshooting Guide

### Build Failures
1. Run `npm run typecheck` to identify TypeScript issues
2. Check for unused imports/variables
3. Verify Drizzle schema matches database state

### Database Issues
1. Check environment variables are set correctly
2. Verify Supabase project is active
3. Ensure RLS policies allow proper access
4. Use Drizzle Studio to inspect data

### Styling Issues
1. Verify `financial-*` classes are defined in `tailwind.config.ts`
2. Check component follows established patterns
3. Test responsive behavior on different screen sizes

### Authentication Problems
1. Check middleware configuration
2. Verify cookie settings in Supabase client
3. Ensure user belongs to a firm (for contact access)

## Migration History

### Key Architectural Changes
1. **Drizzle Migration**: Moved from manual SQL to Drizzle ORM
2. **Design Overhaul**: Implemented modern financial app styling
3. **Route Simplification**: Removed unused pages, focus on `/contacts`
4. **Client/Server Separation**: Proper Server Actions pattern
5. **Navigation Cleanup**: Simplified sidebar, removed placeholder links

This comprehensive context should help future Claude sessions understand the project structure, patterns, and current state of the OffTrail platform.
