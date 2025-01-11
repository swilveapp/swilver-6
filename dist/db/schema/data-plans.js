"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataPlans = exports.planTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const networks_1 = require("./networks");
exports.planTypeEnum = (0, pg_core_1.pgEnum)('plan_type', ['sme', 'gifting', 'corporate']);
exports.dataPlans = (0, pg_core_1.pgTable)('data_plans', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    networkId: (0, pg_core_1.uuid)('network_id').references(() => networks_1.networks.id).notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    code: (0, pg_core_1.text)('code').notNull(),
    description: (0, pg_core_1.text)('description'),
    price: (0, pg_core_1.numeric)('price', { precision: 10, scale: 2 }).notNull(),
    validity: (0, pg_core_1.text)('validity').notNull(),
    size: (0, pg_core_1.text)('size').notNull(),
    type: (0, exports.planTypeEnum)('type').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
