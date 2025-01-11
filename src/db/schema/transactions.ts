import { pgTable, uuid, text, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { networks } from './networks';
import { dataPlans } from './data-plans';

export const transactionTypeEnum = pgEnum('transaction_type', ['airtime', 'data', 'wallet_funding', 'commission_withdrawal']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'processing', 'completed', 'failed']);
export const providerEnum = pgEnum('provider', ['vtpass', 'gladtidings']);

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: transactionTypeEnum('type').notNull(),
  status: transactionStatusEnum('status').notNull().default('pending'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  fee: numeric('fee', { precision: 10, scale: 2 }).notNull().default('0'),
  commission: numeric('commission', { precision: 10, scale: 2 }).notNull().default('0'),
  networkId: uuid('network_id').references(() => networks.id),
  dataPlanId: uuid('data_plan_id').references(() => dataPlans.id),
  phoneNumber: text('phone_number'),
  provider: providerEnum('provider'),
  providerReference: text('provider_reference'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});