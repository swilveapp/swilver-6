import { pgTable, uuid, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'mega_user', 'reseller', 'api_user']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  role: userRoleEnum('role').notNull().default('reseller'),
  isActive: boolean('is_active').notNull().default(true),
  apiKey: text('api_key').unique(),
  apiSecret: text('api_secret'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});