"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wallets = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.wallets = (0, pg_core_1.pgTable)('wallets', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => users_1.users.id).notNull(),
    balance: (0, pg_core_1.numeric)('balance', { precision: 10, scale: 2 }).notNull().default('0'),
    commissionBalance: (0, pg_core_1.numeric)('commission_balance', { precision: 10, scale: 2 }).notNull().default('0'),
    lastFundedAt: (0, pg_core_1.timestamp)('last_funded_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
