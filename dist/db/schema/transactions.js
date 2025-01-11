"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions = exports.providerEnum = exports.transactionStatusEnum = exports.transactionTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
const networks_1 = require("./networks");
const data_plans_1 = require("./data-plans");
exports.transactionTypeEnum = (0, pg_core_1.pgEnum)('transaction_type', ['airtime', 'data', 'wallet_funding', 'commission_withdrawal']);
exports.transactionStatusEnum = (0, pg_core_1.pgEnum)('transaction_status', ['pending', 'processing', 'completed', 'failed']);
exports.providerEnum = (0, pg_core_1.pgEnum)('provider', ['vtpass', 'gladtidings']);
exports.transactions = (0, pg_core_1.pgTable)('transactions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => users_1.users.id).notNull(),
    type: (0, exports.transactionTypeEnum)('type').notNull(),
    status: (0, exports.transactionStatusEnum)('status').notNull().default('pending'),
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(),
    fee: (0, pg_core_1.numeric)('fee', { precision: 10, scale: 2 }).notNull().default('0'),
    commission: (0, pg_core_1.numeric)('commission', { precision: 10, scale: 2 }).notNull().default('0'),
    networkId: (0, pg_core_1.uuid)('network_id').references(() => networks_1.networks.id),
    dataPlanId: (0, pg_core_1.uuid)('data_plan_id').references(() => data_plans_1.dataPlans.id),
    phoneNumber: (0, pg_core_1.text)('phone_number'),
    provider: (0, exports.providerEnum)('provider'),
    providerReference: (0, pg_core_1.text)('provider_reference'),
    metadata: (0, pg_core_1.text)('metadata'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
