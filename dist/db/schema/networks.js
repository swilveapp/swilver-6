"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networks = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.networks = (0, pg_core_1.pgTable)('networks', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name').notNull(),
    code: (0, pg_core_1.text)('code').unique().notNull(),
    logo: (0, pg_core_1.text)('logo'),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    airtimeDiscount: (0, pg_core_1.numeric)('airtime_discount', { precision: 5, scale: 2 }).notNull().default('0'),
    dataDiscount: (0, pg_core_1.numeric)('data_discount', { precision: 5, scale: 2 }).notNull().default('0'),
});
