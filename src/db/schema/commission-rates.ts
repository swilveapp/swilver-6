import { pgTable, uuid, numeric, text } from 'drizzle-orm/pg-core';
import { userRoleEnum } from './users';
import { networks } from './networks';

export const commissionRates = pgTable('commission_rates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userRole: userRoleEnum('user_role').notNull(),
  networkId: uuid('network_id').references(() => networks.id).notNull(),
  serviceType: text('service_type').notNull(),
  rate: numeric('rate', { precision: 5, scale: 2 }).notNull(),
});