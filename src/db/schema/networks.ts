import { pgTable, uuid, text, boolean, numeric } from 'drizzle-orm/pg-core';

export const networks = pgTable('networks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').unique().notNull(),
  logo: text('logo'),
  isActive: boolean('is_active').notNull().default(true),
  airtimeDiscount: numeric('airtime_discount', { precision: 5, scale: 2 }).notNull().default('0'),
  dataDiscount: numeric('data_discount', { precision: 5, scale: 2 }).notNull().default('0'),
});