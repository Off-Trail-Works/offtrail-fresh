-- Seed data for offtrail app
-- Creates firms and contacts (advisors created via auth flow)

-- Clear existing data (in dependency order)
DELETE FROM contacts;
DELETE FROM advisors;
DELETE FROM firms;

-- Force commit
-- Insert firms with specific UUIDs for consistency
INSERT INTO firms (id, name, slug, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Wealth Management Partners', 'wealth-management-partners', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Financial Planning Group', 'financial-planning-group', NOW(), NOW());

-- Insert 1000 contacts for Wealth Management Partners
INSERT INTO contacts (firm_id, first_name, last_name, email, phone, status, created_at, updated_at)
SELECT
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  CASE (n % 40)
    WHEN 0 THEN 'Alexander' WHEN 1 THEN 'Michael' WHEN 2 THEN 'William' WHEN 3 THEN 'James' WHEN 4 THEN 'David'
    WHEN 5 THEN 'Christopher' WHEN 6 THEN 'Joseph' WHEN 7 THEN 'Matthew' WHEN 8 THEN 'Anthony' WHEN 9 THEN 'Mark'
    WHEN 10 THEN 'Daniel' WHEN 11 THEN 'Paul' WHEN 12 THEN 'Steven' WHEN 13 THEN 'Andrew' WHEN 14 THEN 'Joshua'
    WHEN 15 THEN 'Kenneth' WHEN 16 THEN 'Kevin' WHEN 17 THEN 'Brian' WHEN 18 THEN 'George' WHEN 19 THEN 'Timothy'
    WHEN 20 THEN 'Mary' WHEN 21 THEN 'Patricia' WHEN 22 THEN 'Jennifer' WHEN 23 THEN 'Linda' WHEN 24 THEN 'Elizabeth'
    WHEN 25 THEN 'Barbara' WHEN 26 THEN 'Susan' WHEN 27 THEN 'Jessica' WHEN 28 THEN 'Sarah' WHEN 29 THEN 'Karen'
    WHEN 30 THEN 'Lisa' WHEN 31 THEN 'Nancy' WHEN 32 THEN 'Betty' WHEN 33 THEN 'Helen' WHEN 34 THEN 'Sandra'
    WHEN 35 THEN 'Donna' WHEN 36 THEN 'Carol' WHEN 37 THEN 'Ruth' WHEN 38 THEN 'Sharon' WHEN 39 THEN 'Michelle'
  END,
  CASE (n % 50)
    WHEN 0 THEN 'Smith' WHEN 1 THEN 'Johnson' WHEN 2 THEN 'Williams' WHEN 3 THEN 'Brown' WHEN 4 THEN 'Jones'
    WHEN 5 THEN 'Garcia' WHEN 6 THEN 'Miller' WHEN 7 THEN 'Davis' WHEN 8 THEN 'Rodriguez' WHEN 9 THEN 'Martinez'
    WHEN 10 THEN 'Hernandez' WHEN 11 THEN 'Lopez' WHEN 12 THEN 'Gonzalez' WHEN 13 THEN 'Wilson' WHEN 14 THEN 'Anderson'
    WHEN 15 THEN 'Thomas' WHEN 16 THEN 'Taylor' WHEN 17 THEN 'Moore' WHEN 18 THEN 'Jackson' WHEN 19 THEN 'Martin'
    WHEN 20 THEN 'Lee' WHEN 21 THEN 'Perez' WHEN 22 THEN 'Thompson' WHEN 23 THEN 'White' WHEN 24 THEN 'Harris'
    WHEN 25 THEN 'Sanchez' WHEN 26 THEN 'Clark' WHEN 27 THEN 'Ramirez' WHEN 28 THEN 'Lewis' WHEN 29 THEN 'Robinson'
    WHEN 30 THEN 'Walker' WHEN 31 THEN 'Young' WHEN 32 THEN 'Allen' WHEN 33 THEN 'King' WHEN 34 THEN 'Wright'
    WHEN 35 THEN 'Scott' WHEN 36 THEN 'Torres' WHEN 37 THEN 'Nguyen' WHEN 38 THEN 'Hill' WHEN 39 THEN 'Flores'
    WHEN 40 THEN 'Green' WHEN 41 THEN 'Adams' WHEN 42 THEN 'Nelson' WHEN 43 THEN 'Baker' WHEN 44 THEN 'Hall'
    WHEN 45 THEN 'Rivera' WHEN 46 THEN 'Campbell' WHEN 47 THEN 'Mitchell' WHEN 48 THEN 'Carter' WHEN 49 THEN 'Roberts'
  END,
  LOWER(
    CASE (n % 40)
      WHEN 0 THEN 'Alexander' WHEN 1 THEN 'Michael' WHEN 2 THEN 'William' WHEN 3 THEN 'James' WHEN 4 THEN 'David'
      WHEN 5 THEN 'Christopher' WHEN 6 THEN 'Joseph' WHEN 7 THEN 'Matthew' WHEN 8 THEN 'Anthony' WHEN 9 THEN 'Mark'
      WHEN 10 THEN 'Daniel' WHEN 11 THEN 'Paul' WHEN 12 THEN 'Steven' WHEN 13 THEN 'Andrew' WHEN 14 THEN 'Joshua'
      WHEN 15 THEN 'Kenneth' WHEN 16 THEN 'Kevin' WHEN 17 THEN 'Brian' WHEN 18 THEN 'George' WHEN 19 THEN 'Timothy'
      WHEN 20 THEN 'Mary' WHEN 21 THEN 'Patricia' WHEN 22 THEN 'Jennifer' WHEN 23 THEN 'Linda' WHEN 24 THEN 'Elizabeth'
      WHEN 25 THEN 'Barbara' WHEN 26 THEN 'Susan' WHEN 27 THEN 'Jessica' WHEN 28 THEN 'Sarah' WHEN 29 THEN 'Karen'
      WHEN 30 THEN 'Lisa' WHEN 31 THEN 'Nancy' WHEN 32 THEN 'Betty' WHEN 33 THEN 'Helen' WHEN 34 THEN 'Sandra'
      WHEN 35 THEN 'Donna' WHEN 36 THEN 'Carol' WHEN 37 THEN 'Ruth' WHEN 38 THEN 'Sharon' WHEN 39 THEN 'Michelle'
    END
  ) || '.' ||
  LOWER(
    CASE (n % 50)
      WHEN 0 THEN 'Smith' WHEN 1 THEN 'Johnson' WHEN 2 THEN 'Williams' WHEN 3 THEN 'Brown' WHEN 4 THEN 'Jones'
      WHEN 5 THEN 'Garcia' WHEN 6 THEN 'Miller' WHEN 7 THEN 'Davis' WHEN 8 THEN 'Rodriguez' WHEN 9 THEN 'Martinez'
      WHEN 10 THEN 'Hernandez' WHEN 11 THEN 'Lopez' WHEN 12 THEN 'Gonzalez' WHEN 13 THEN 'Wilson' WHEN 14 THEN 'Anderson'
      WHEN 15 THEN 'Thomas' WHEN 16 THEN 'Taylor' WHEN 17 THEN 'Moore' WHEN 18 THEN 'Jackson' WHEN 19 THEN 'Martin'
      WHEN 20 THEN 'Lee' WHEN 21 THEN 'Perez' WHEN 22 THEN 'Thompson' WHEN 23 THEN 'White' WHEN 24 THEN 'Harris'
      WHEN 25 THEN 'Sanchez' WHEN 26 THEN 'Clark' WHEN 27 THEN 'Ramirez' WHEN 28 THEN 'Lewis' WHEN 29 THEN 'Robinson'
      WHEN 30 THEN 'Walker' WHEN 31 THEN 'Young' WHEN 32 THEN 'Allen' WHEN 33 THEN 'King' WHEN 34 THEN 'Wright'
      WHEN 35 THEN 'Scott' WHEN 36 THEN 'Torres' WHEN 37 THEN 'Nguyen' WHEN 38 THEN 'Hill' WHEN 39 THEN 'Flores'
      WHEN 40 THEN 'Green' WHEN 41 THEN 'Adams' WHEN 42 THEN 'Nelson' WHEN 43 THEN 'Baker' WHEN 44 THEN 'Hall'
      WHEN 45 THEN 'Rivera' WHEN 46 THEN 'Campbell' WHEN 47 THEN 'Mitchell' WHEN 48 THEN 'Carter' WHEN 49 THEN 'Roberts'
    END
  ) || n || '@email.com',
  '555-' || LPAD(n::text, 4, '0'),
  CASE (n % 4)
    WHEN 0 THEN 'prospect'
    WHEN 1 THEN 'active'
    WHEN 2 THEN 'inactive'
    WHEN 3 THEN 'former'
  END,
  NOW(),
  NOW()
FROM generate_series(1, 1000) AS n;

-- Insert 100 contacts for Financial Planning Group
INSERT INTO contacts (firm_id, first_name, last_name, email, phone, status, created_at, updated_at)
SELECT
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  CASE (n % 20)
    WHEN 0 THEN 'Emma' WHEN 1 THEN 'Liam' WHEN 2 THEN 'Olivia' WHEN 3 THEN 'Noah' WHEN 4 THEN 'Ava'
    WHEN 5 THEN 'Elijah' WHEN 6 THEN 'Sophia' WHEN 7 THEN 'Logan' WHEN 8 THEN 'Isabella' WHEN 9 THEN 'Lucas'
    WHEN 10 THEN 'Mia' WHEN 11 THEN 'Oliver' WHEN 12 THEN 'Charlotte' WHEN 13 THEN 'Ethan' WHEN 14 THEN 'Amelia'
    WHEN 15 THEN 'Aiden' WHEN 16 THEN 'Harper' WHEN 17 THEN 'Sebastian' WHEN 18 THEN 'Evelyn' WHEN 19 THEN 'Mason'
  END,
  CASE (n % 25)
    WHEN 0 THEN 'Johnson' WHEN 1 THEN 'Williams' WHEN 2 THEN 'Brown' WHEN 3 THEN 'Jones' WHEN 4 THEN 'Garcia'
    WHEN 5 THEN 'Miller' WHEN 6 THEN 'Davis' WHEN 7 THEN 'Rodriguez' WHEN 8 THEN 'Martinez' WHEN 9 THEN 'Hernandez'
    WHEN 10 THEN 'Lopez' WHEN 11 THEN 'Gonzalez' WHEN 12 THEN 'Wilson' WHEN 13 THEN 'Anderson' WHEN 14 THEN 'Thomas'
    WHEN 15 THEN 'Taylor' WHEN 16 THEN 'Moore' WHEN 17 THEN 'Jackson' WHEN 18 THEN 'Martin' WHEN 19 THEN 'Lee'
    WHEN 20 THEN 'Perez' WHEN 21 THEN 'Thompson' WHEN 22 THEN 'White' WHEN 23 THEN 'Harris' WHEN 24 THEN 'Sanchez'
  END,
  LOWER(
    CASE (n % 20)
      WHEN 0 THEN 'Emma' WHEN 1 THEN 'Liam' WHEN 2 THEN 'Olivia' WHEN 3 THEN 'Noah' WHEN 4 THEN 'Ava'
      WHEN 5 THEN 'Elijah' WHEN 6 THEN 'Sophia' WHEN 7 THEN 'Logan' WHEN 8 THEN 'Isabella' WHEN 9 THEN 'Lucas'
      WHEN 10 THEN 'Mia' WHEN 11 THEN 'Oliver' WHEN 12 THEN 'Charlotte' WHEN 13 THEN 'Ethan' WHEN 14 THEN 'Amelia'
      WHEN 15 THEN 'Aiden' WHEN 16 THEN 'Harper' WHEN 17 THEN 'Sebastian' WHEN 18 THEN 'Evelyn' WHEN 19 THEN 'Mason'
    END
  ) || '.' ||
  LOWER(
    CASE (n % 25)
      WHEN 0 THEN 'Johnson' WHEN 1 THEN 'Williams' WHEN 2 THEN 'Brown' WHEN 3 THEN 'Jones' WHEN 4 THEN 'Garcia'
      WHEN 5 THEN 'Miller' WHEN 6 THEN 'Davis' WHEN 7 THEN 'Rodriguez' WHEN 8 THEN 'Martinez' WHEN 9 THEN 'Hernandez'
      WHEN 10 THEN 'Lopez' WHEN 11 THEN 'Gonzalez' WHEN 12 THEN 'Wilson' WHEN 13 THEN 'Anderson' WHEN 14 THEN 'Thomas'
      WHEN 15 THEN 'Taylor' WHEN 16 THEN 'Moore' WHEN 17 THEN 'Jackson' WHEN 18 THEN 'Martin' WHEN 19 THEN 'Lee'
      WHEN 20 THEN 'Perez' WHEN 21 THEN 'Thompson' WHEN 22 THEN 'White' WHEN 23 THEN 'Harris' WHEN 24 THEN 'Sanchez'
    END
  ) || (n + 1000) || '@financialplanning.com',
  '555-' || LPAD((n + 1000)::text, 4, '0'),
  CASE (n % 3)
    WHEN 0 THEN 'prospect'
    WHEN 1 THEN 'active'
    WHEN 2 THEN 'inactive'
  END,
  NOW(),
  NOW()
FROM generate_series(1, 100) AS n;
