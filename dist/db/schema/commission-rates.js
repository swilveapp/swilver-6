"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commissionRates = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
const networks_1 = require("./networks");
exports.commissionRates = (0, pg_core_1.pgTable)('commission_rates', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userRole: (0, users_1.userRoleEnum)('user_role').notNull(),
    networkId: (0, pg_core_1.uuid)('network_id').references(() => networks_1.networks.id).notNull(),
    serviceType: (0, pg_core_1.text)('service_type').notNull(),
    rate: (0, pg_core_1.numeric)('rate', { precision: 5, scale: 2 }).notNull(),
});
