"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCommission = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const numeric_1 = require("../../utils/numeric");
const calculateCommission = async ({ userRole, networkId, serviceType, amount, }) => {
    const rate = await db_1.db.query.commissionRates.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.commissionRates.userRole, userRole), (0, drizzle_orm_1.eq)(schema_1.commissionRates.networkId, networkId), (0, drizzle_orm_1.eq)(schema_1.commissionRates.serviceType, serviceType)),
    });
    if (!rate) {
        return 0;
    }
    const rateValue = (0, numeric_1.parseNumeric)(rate.rate);
    return (amount * rateValue) / 100;
};
exports.calculateCommission = calculateCommission;
