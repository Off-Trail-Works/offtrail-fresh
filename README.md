# OffTrail Wealth Management Platform

A modern, professional wealth management and client relationship management platform built with Next.js 15, Supabase, and Drizzle ORM.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Database ORM**: Drizzle ORM with type-safe schema
- **Styling**: Tailwind CSS with custom financial app design system
- **UI Components**: Custom components with Lucide React icons
- **Authentication**: Supabase Auth with session management

### Database Architecture
- **Multi-tenant** design with Row-Level Security (RLS)
- **Firms** → **Advisors** → **Contacts** relationship hierarchy
- Automatic test advisor creation for branch deployments
- Vault-based secret management for production security

### Design System
Professional financial app styling inspired by leading platforms:
- **Color System**: Custom `financial-*` color palette (blue, green, red, amber, gray)
- **Typography**: Inter font family with professional hierarchy
- **Components**: Modern cards, tables, forms with financial app patterns
- **Responsive**: Desktop table views, mobile card layouts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd offtrail-fresh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

   Copy `.env.example` to `.env.local` and configure:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_database_connection_string
   ```

4. **Database Setup**

   **Option A: Drizzle (Recommended for Development)**
   ```bash
   # Generate and run migrations
   npm run db:generate
   npm run db:migrate

   # Seed the database
   npm run db:seed
   ```

   **Option B: Supabase SQL Editor**
   - Run the migrations from `supabase/migrations/`
   - Run the seed from `supabase/seed.sql`

5. **Start Development Server**
   ```bash
   # Basic development
   npm run dev

   # Development with type checking and linting
   npm run dev:check
   ```

## 📁 Project Structure

```
offtrail-fresh/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions
│   │   └── contacts.ts          # Contact data fetching
│   ├── auth/                    # Authentication pages
│   │   └── login/               # Login page
│   ├── contacts/                # Main contacts/client management
│   ├── create-advisor/          # Advisor registration
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Root page (redirects to /contacts)
├── components/                   # React Components
│   ├── ui/                      # Base UI components
│   ├── header.tsx               # App header with navigation
│   ├── sidebar.tsx              # Sidebar navigation
│   └── login-form.tsx           # Modern login form
├── lib/                         # Utilities and configurations
│   ├── db/                      # Database layer
│   │   ├── client.ts            # Client-side exports (types only)
│   │   ├── schema.ts            # Drizzle schema with RLS policies
│   │   └── server.ts            # Server-side database connection
│   ├── supabase/               # Supabase configuration
│   │   ├── client.ts           # Client-side Supabase
│   │   ├── middleware.ts       # Auth middleware
│   │   └── server.ts           # Server-side Supabase
│   └── utils.ts                # Utility functions
├── scripts/                     # Build and maintenance scripts
│   ├── create-test-advisor.js  # Test advisor creation
│   └── seed-drizzle.ts         # Database seeding
├── supabase/                    # Supabase configuration
│   ├── migrations/             # Database migrations
│   └── seed.sql                # SQL seed file
├── tailwind.config.ts          # Tailwind with financial design system
└── drizzle.config.ts           # Drizzle ORM configuration
```

## 🧭 Available Commands

### Development
```bash
npm run dev              # Start development server
npm run dev:check        # Dev server + TypeScript checking + linting
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript type checking
```

### Database Management
```bash
npm run db:generate      # Generate Drizzle migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes (development)
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database with test data
```

### Testing & Utilities
```bash
npm run create-test-advisor  # Create test advisor for branch deployments
```

## 🗄️ Database Schema

### Core Tables

**firms**
- `id` (UUID, Primary Key)
- `name` (Text) - Firm name
- `slug` (Text, Unique) - URL-friendly identifier
- `created_at`, `updated_at` (Timestamps)

**advisors**
- `id` (UUID, Primary Key) - Maps to Supabase Auth user ID
- `firm_id` (UUID, Foreign Key) - References firms.id
- `email` (Text, Unique)
- `first_name`, `last_name` (Text)
- `role` (Enum: 'advisor', 'senior_advisor', 'partner')
- `created_at`, `updated_at` (Timestamps)

**contacts**
- `id` (UUID, Primary Key)
- `firm_id` (UUID, Foreign Key) - References firms.id
- `first_name`, `last_name` (Text)
- `email`, `phone` (Text, Optional)
- `status` (Enum: 'prospect', 'active', 'inactive', 'former')
- `created_at`, `updated_at` (Timestamps)

### Row-Level Security (RLS)
- **Firms**: Advisors can only see their own firm
- **Advisors**: Can view own record and same-firm colleagues
- **Contacts**: Can only access contacts from their firm

## 🎨 Design System

### Color Palette
```css
financial-blue:    Trust and professionalism (#1A5276)
financial-green:   Success and growth (#27AE60)
financial-red:     Alerts and losses (#E74C3C)
financial-amber:   Warnings and attention (#F39C12)
financial-gray:    Neutral backgrounds and text
```

### Component Patterns
- **Cards**: Rounded corners, subtle shadows, clean borders
- **Forms**: Icon-enhanced inputs, professional focus states
- **Tables**: Clean headers, hover states, status indicators
- **Navigation**: Hierarchical structure, active states
- **Buttons**: Professional gradients, proper disabled states

## 🔐 Authentication & Security

### Authentication Flow
1. Users sign in via `/auth/login`
2. Successful login redirects to `/contacts` (main app)
3. Middleware protects routes requiring authentication
4. Session managed via Supabase Auth cookies

### Security Features
- Row-Level Security (RLS) policies
- Supabase Vault for secret management
- JWT-based authentication
- Secure cookie-based sessions
- CSRF protection via middleware

## 🌱 Seeding & Test Data

The project includes comprehensive seed data:
- **3 firms** with varying contact counts
- **28 total contacts** across all firms
- **Mixed status distribution** (active, prospect, inactive, former)
- **Realistic names and contact information**

Firms included:
- **Wealth Management Partners** (15 contacts) - Primary test firm
- **Investment Solutions LLC** (8 contacts)
- **Financial Planning Group** (5 contacts)

## 🚢 Deployment

### Environment Variables
Ensure all required environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

### Database Setup
1. Run migrations via Supabase dashboard or Drizzle
2. Execute seed data from `supabase/seed.sql`
3. Create test advisor using the Edge Function

### Branch Deployments
- Automatic test advisor creation for branch databases
- Vault-based secret access for security
- Admin override key bypasses RLS for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Ensure type safety and linting pass
5. Submit a pull request

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🔧 Troubleshooting

### Common Issues
- **Build failures**: Run `npm run typecheck` to identify TypeScript errors
- **Database connection**: Verify environment variables and Supabase project status
- **RLS policies**: Ensure user is properly authenticated and belongs to a firm
- **Styling issues**: Check Tailwind configuration and custom financial classes

For additional help, check the `CLAUDE.md` file for development context and patterns.
