-- Supabase seed file
-- This file contains the same seed data as our Drizzle seed script

-- Insert firms
INSERT INTO firms (id, name, slug, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Wealth Management Partners', 'wealth-management-partners', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Investment Solutions LLC', 'investment-solutions-llc', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Financial Planning Group', 'financial-planning-group', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert contacts for Wealth Management Partners (15 contacts - most contacts)
INSERT INTO contacts (firm_id, first_name, last_name, email, phone, status, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'John', 'Smith', 'john.smith@email.com', '555-0101', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '555-0102', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Michael', 'Brown', 'michael.brown@email.com', '555-0103', 'prospect', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Emily', 'Davis', 'emily.davis@email.com', '555-0104', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'David', 'Wilson', 'david.wilson@email.com', '555-0105', 'inactive', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Lisa', 'Miller', 'lisa.miller@email.com', '555-0106', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Robert', 'Moore', 'robert.moore@email.com', '555-0107', 'prospect', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Jennifer', 'Taylor', 'jennifer.taylor@email.com', '555-0108', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'James', 'Anderson', 'james.anderson@email.com', '555-0109', 'former', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Mary', 'Thomas', 'mary.thomas@email.com', '555-0110', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Christopher', 'Jackson', 'chris.jackson@email.com', '555-0111', 'prospect', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Patricia', 'White', 'patricia.white@email.com', '555-0112', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Daniel', 'Harris', 'daniel.harris@email.com', '555-0113', 'inactive', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Jessica', 'Martin', 'jessica.martin@email.com', '555-0114', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Matthew', 'Garcia', 'matthew.garcia@email.com', '555-0115', 'prospect', NOW(), NOW()),

-- Insert contacts for Investment Solutions LLC (8 contacts)
  ('550e8400-e29b-41d4-a716-446655440002', 'Amanda', 'Rodriguez', 'amanda.rodriguez@email.com', '555-0201', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Ryan', 'Lewis', 'ryan.lewis@email.com', '555-0202', 'prospect', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Nicole', 'Walker', 'nicole.walker@email.com', '555-0203', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Kevin', 'Hall', 'kevin.hall@email.com', '555-0204', 'inactive', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Ashley', 'Allen', 'ashley.allen@email.com', '555-0205', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Brian', 'Young', 'brian.young@email.com', '555-0206', 'former', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Stephanie', 'King', 'stephanie.king@email.com', '555-0207', 'prospect', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Joseph', 'Wright', 'joseph.wright@email.com', '555-0208', 'active', NOW(), NOW()),

-- Insert contacts for Financial Planning Group (5 contacts)
  ('550e8400-e29b-41d4-a716-446655440003', 'Michelle', 'Lopez', 'michelle.lopez@email.com', '555-0301', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Andrew', 'Hill', 'andrew.hill@email.com', '555-0302', 'prospect', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Lauren', 'Scott', 'lauren.scott@email.com', '555-0303', 'inactive', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Thomas', 'Green', 'thomas.green@email.com', '555-0304', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Rachel', 'Adams', 'rachel.adams@email.com', '555-0305', 'former', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;