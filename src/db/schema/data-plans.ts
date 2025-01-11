import { pgTable, uuid, text, numeric, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { networks } from './networks';

export const planTypeEnum = pgEnum('plan_type', ['sme', 'gifting', 'corporate']);

export const dataPlans = pgTable('data_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  networkId: uuid('network_id').references(() => networks.id).notNull(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  validity: text('validity').notNull(),
  size: text('size').notNull(),
  type: planTypeEnum('type').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});