import { pgTable, uuid, text, timestamp, pgEnum, pgPolicy } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Define enums
export const contactStatusEnum = pgEnum('contact_status', [
  'prospect', 
  'active', 
  'inactive', 
  'former'
]);

export const advisorRoleEnum = pgEnum('advisor_role', [
  'owner',
  'advisor', 
  'assistant'
]);

// Define tables
export const firms = pgTable('firms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, () => [
  pgPolicy('firms_view_own', {
    for: 'select',
    to: 'public',
    using: sql`id IN (SELECT firm_id FROM advisors WHERE id = auth.uid())`,
  }),
]);

export const advisors = pgTable('advisors', {
  id: uuid('id').primaryKey(), // Supabase Auth user ID
  firmId: uuid('firm_id').notNull().references(() => firms.id),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: advisorRoleEnum('role').default('advisor').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, () => [
  pgPolicy('advisors_view_own', {
    for: 'select',
    to: 'public',
    using: sql`id = auth.uid()`,
  }),
  pgPolicy('advisors_view_same_firm', {
    for: 'select',
    to: 'public',
    using: sql`firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid())`,
  }),
  pgPolicy('advisors_update_own', {
    for: 'update',
    to: 'public',
    using: sql`id = auth.uid()`,
  }),
]);

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  firmId: uuid('firm_id').notNull().references(() => firms.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').unique(),
  phone: text('phone'),
  status: contactStatusEnum('status').default('prospect').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, () => [
  pgPolicy('contacts_view_same_firm', {
    for: 'select',
    to: 'public',
    using: sql`firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid())`,
  }),
  pgPolicy('contacts_insert_same_firm', {
    for: 'insert',
    to: 'public',
    withCheck: sql`firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid())`,
  }),
  pgPolicy('contacts_update_same_firm', {
    for: 'update',
    to: 'public',
    using: sql`firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid())`,
  }),
  pgPolicy('contacts_delete_same_firm', {
    for: 'delete',
    to: 'public',
    using: sql`firm_id IN (SELECT firm_id FROM advisors WHERE id = auth.uid())`,
  }),
]);

// Define relations
export const firmsRelations = relations(firms, ({ many }) => ({
  advisors: many(advisors),
  contacts: many(contacts),
}));

export const advisorsRelations = relations(advisors, ({ one }) => ({
  firm: one(firms, {
    fields: [advisors.firmId],
    references: [firms.id],
  }),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  firm: one(firms, {
    fields: [contacts.firmId],
    references: [firms.id],
  }),
}));

// Export types
export type Firm = typeof firms.$inferSelect;
export type NewFirm = typeof firms.$inferInsert;
export type Advisor = typeof advisors.$inferSelect;
export type NewAdvisor = typeof advisors.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;