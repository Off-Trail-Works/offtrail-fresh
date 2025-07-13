import { db } from '../lib/db/server.js';
import { firms as firmsTable, advisors as advisorsTable, contacts as contactsTable } from '../lib/db/schema.js';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create firms
    const firms = await db.insert(firmsTable).values([
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Wealth Management Partners',
        slug: 'wealth-management-partners',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Investment Solutions LLC',
        slug: 'investment-solutions-llc',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Financial Planning Group',
        slug: 'financial-planning-group',
      }
    ]).returning();

    console.log('✅ Created firms:', firms.length);

    // Create contacts for the first firm (most contacts)
    const contacts = await db.insert(contactsTable).values([
      // Wealth Management Partners contacts (15 contacts)
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', phone: '555-0101', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com', phone: '555-0102', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@email.com', phone: '555-0103', status: 'prospect' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@email.com', phone: '555-0104', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'David', lastName: 'Wilson', email: 'david.wilson@email.com', phone: '555-0105', status: 'inactive' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Lisa', lastName: 'Miller', email: 'lisa.miller@email.com', phone: '555-0106', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Robert', lastName: 'Moore', email: 'robert.moore@email.com', phone: '555-0107', status: 'prospect' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Jennifer', lastName: 'Taylor', email: 'jennifer.taylor@email.com', phone: '555-0108', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'James', lastName: 'Anderson', email: 'james.anderson@email.com', phone: '555-0109', status: 'former' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Mary', lastName: 'Thomas', email: 'mary.thomas@email.com', phone: '555-0110', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Christopher', lastName: 'Jackson', email: 'chris.jackson@email.com', phone: '555-0111', status: 'prospect' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Patricia', lastName: 'White', email: 'patricia.white@email.com', phone: '555-0112', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Daniel', lastName: 'Harris', email: 'daniel.harris@email.com', phone: '555-0113', status: 'inactive' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Jessica', lastName: 'Martin', email: 'jessica.martin@email.com', phone: '555-0114', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440001', firstName: 'Matthew', lastName: 'Garcia', email: 'matthew.garcia@email.com', phone: '555-0115', status: 'prospect' },

      // Investment Solutions LLC contacts (8 contacts)
      { firmId: '550e8400-e29b-41d4-a716-446655440002', firstName: 'Amanda', lastName: 'Rodriguez', email: 'amanda.rodriguez@email.com', phone: '555-0201', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440002', firstName: 'Ryan', lastName: 'Lewis', email: 'ryan.lewis@email.com', phone: '555-0202', status: 'prospect' },
      { firmId: '550e8400-e29b-41d4-a716-446655440002', firstName: 'Nicole', lastName: 'Walker', email: 'nicole.walker@email.com', phone: '555-0203', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440002', firstName: 'Kevin', lastName: 'Hall', email: 'kevin.hall@email.com', phone: '555-0204', status: 'inactive' },
      { firmId: '550e8400-e29b-41d4-a716-446655440002', firstName: 'Ashley', lastName: 'Allen', email: 'ashley.allen@email.com', phone: '555-0205', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440002', firstName: 'Brian', lastName: 'Young', email: 'brian.young@email.com', phone: '555-0206', status: 'former' },
      { firmId: '550e8400-e29b-41d4-a716-446655440002', firstName: 'Stephanie', lastName: 'King', email: 'stephanie.king@email.com', phone: '555-0207', status: 'prospect' },
      { firmId: '550e8400-e29b-41d4-a716-446655440002', firstName: 'Joseph', lastName: 'Wright', email: 'joseph.wright@email.com', phone: '555-0208', status: 'active' },

      // Financial Planning Group contacts (5 contacts)
      { firmId: '550e8400-e29b-41d4-a716-446655440003', firstName: 'Michelle', lastName: 'Lopez', email: 'michelle.lopez@email.com', phone: '555-0301', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440003', firstName: 'Andrew', lastName: 'Hill', email: 'andrew.hill@email.com', phone: '555-0302', status: 'prospect' },
      { firmId: '550e8400-e29b-41d4-a716-446655440003', firstName: 'Lauren', lastName: 'Scott', email: 'lauren.scott@email.com', phone: '555-0303', status: 'inactive' },
      { firmId: '550e8400-e29b-41d4-a716-446655440003', firstName: 'Thomas', lastName: 'Green', email: 'thomas.green@email.com', phone: '555-0304', status: 'active' },
      { firmId: '550e8400-e29b-41d4-a716-446655440003', firstName: 'Rachel', lastName: 'Adams', email: 'rachel.adams@email.com', phone: '555-0305', status: 'former' },
    ]).returning();

    console.log('✅ Created contacts:', contacts.length);
    console.log('🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();