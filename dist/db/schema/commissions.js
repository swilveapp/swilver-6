"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commissions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
const transactions_1 = require("./transactions");
exports.commissions = (0, pg_core_1.pgTable)('commissions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => users_1.users.id).notNull(),
    transactionId: (0, pg_core_1.uuid)('transaction_id').references(() => transactions_1.transactions.id).notNull(),
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
