import { pgTable, uuid, numeric, timestamp, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  balance: numeric('balance', { precision: 10, scale: 2 }).notNull().default('0'),
  commissionBalance: numeric('commission_balance', { precision: 10, scale: 2 }).notNull().default('0'),
  lastFundedAt: timestamp('last_funded_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});