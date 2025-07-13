# OffTrail CRM - Fresh Start

This is a clean implementation of the OffTrail CRM using Vercel's native Supabase integration.

## Features

- ✅ Next.js 15 with App Router
- ✅ Supabase Auth with cookie-based sessions  
- ✅ Row Level Security (RLS) policies
- ✅ Multi-tenant architecture (firms → advisors → contacts)
- ✅ Automatic environment variable sync via Vercel Marketplace
- ✅ Branch database support
- ✅ TypeScript + Tailwind CSS + shadcn/ui

## Database Schema

- **firms**: Organizations that contain advisors and contacts
- **advisors**: Users linked to Supabase Auth, belong to a firm
- **contacts**: Customer data, scoped by firm via RLS

## Quick Start

### 1. Deploy to Vercel

1. Push this repo to GitHub
2. Connect to Vercel 
3. Add Supabase integration via Vercel Marketplace
4. Deploy - all environment variables sync automatically!

### 2. Run Migrations

The migrations will run automatically when you deploy via Vercel's Supabase integration.

### 3. Create Test Data

1. Visit `/create-advisor` 
2. Choose "Wealth Management Partners" (has 1000 seeded contacts)
3. Create your advisor account
4. Log in and visit `/contacts` to see the data

## Environment Variables (Auto-Configured)

When using Vercel Marketplace integration, these are set automatically:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Local Development

1. Clone and install:
```bash
npm install
```

2. Get environment variables from Vercel:
```bash
vercel env pull .env.local
```

3. Run development server:
```bash
npm run dev
```

## Key Differences from Original

- ✅ Uses official Vercel + Supabase template
- ✅ Native marketplace integration (auto env vars)
- ✅ Branch databases work automatically
- ✅ Cookie-based auth (works with SSR)
- ✅ No monorepo complexity
- ✅ No custom migration scripts needed
- ✅ Built-in shadcn/ui components

## Pages

- `/` - Home page with navigation
- `/auth/login` - Sign in page  
- `/auth/sign-up` - Sign up page
- `/contacts` - View contacts (requires advisor account)
- `/create-advisor` - Create advisor account for testing
- `/api/create-advisor` - API endpoint for advisor creation

## Architecture Benefits

1. **Simplified Setup**: Single command deployment
2. **Automatic Scaling**: Vercel handles everything
3. **Branch Databases**: Each git branch gets its own database
4. **Unified Billing**: One bill through Vercel
5. **Environment Sync**: No manual env var management
6. **Security**: RLS policies protect data by firm

## Next Steps

1. Deploy to Vercel with Supabase integration
2. Test advisor creation and contacts view
3. Add additional CRM features as needed
4. Customize UI/branding

This approach eliminates all the complexity we encountered with the original setup!