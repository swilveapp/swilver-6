import { pgTable, uuid, numeric, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { transactions } from './transactions';

export const commissions = pgTable('commissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});