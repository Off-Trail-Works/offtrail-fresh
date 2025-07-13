-- Create initial schema for offtrail app
-- Firms, Advisors, and Contacts with RLS

-- Test
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create firms table
CREATE TABLE firms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create advisors table (linked to Supabase Auth)
CREATE TABLE advisors (
  id UUID PRIMARY KEY, -- Uses Supabase Auth user ID directly
  firm_id UUID REFERENCES firms(id) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'advisor', -- owner, advisor, assistant
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id UUID REFERENCES firms(id) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect', 'active', 'inactive', 'former')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_advisors_firm_id ON advisors(firm_id);
CREATE INDEX idx_contacts_firm_id ON contacts(firm_id);
CREATE INDEX idx_contacts_status ON contacts(status);

-- Enable Row Level Security
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Firms: Advisors can only see their own firm
CREATE POLICY "Advisors can view their own firm" ON firms
  FOR SELECT USING (
    id IN (
      SELECT firm_id FROM advisors WHERE id = auth.uid()
    )
  );

-- Advisors: Can view other advisors in same firm
CREATE POLICY "Advisors can view advisors in same firm" ON advisors
  FOR SELECT USING (
    firm_id IN (
      SELECT firm_id FROM advisors WHERE id = auth.uid()
    )
  );

-- Advisors: Can update their own record
CREATE POLICY "Advisors can update own record" ON advisors
  FOR UPDATE USING (id = auth.uid());

-- Contacts: Can view/manage contacts in same firm
CREATE POLICY "Advisors can view contacts in same firm" ON contacts
  FOR SELECT USING (
    firm_id IN (
      SELECT firm_id FROM advisors WHERE id = auth.uid()
    )
  );

CREATE POLICY "Advisors can insert contacts in same firm" ON contacts
  FOR INSERT WITH CHECK (
    firm_id IN (
      SELECT firm_id FROM advisors WHERE id = auth.uid()
    )
  );

CREATE POLICY "Advisors can update contacts in same firm" ON contacts
  FOR UPDATE USING (
    firm_id IN (
      SELECT firm_id FROM advisors WHERE id = auth.uid()
    )
  );

CREATE POLICY "Advisors can delete contacts in same firm" ON contacts
  FOR DELETE USING (
    firm_id IN (
      SELECT firm_id FROM advisors WHERE id = auth.uid()
    )
  );

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_firms_updated_at
  BEFORE UPDATE ON firms
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_advisors_updated_at
  BEFORE UPDATE ON advisors
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
