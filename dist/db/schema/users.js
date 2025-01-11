"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.userRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userRoleEnum = (0, pg_core_1.pgEnum)('user_role', ['admin', 'mega_user', 'reseller', 'api_user']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.text)('email').unique().notNull(),
    password: (0, pg_core_1.text)('password').notNull(),
    fullName: (0, pg_core_1.text)('full_name').notNull(),
    phone: (0, pg_core_1.text)('phone').notNull(),
    role: (0, exports.userRoleEnum)('role').notNull().default('reseller'),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    apiKey: (0, pg_core_1.text)('api_key').unique(),
    apiSecret: (0, pg_core_1.text)('api_secret'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
