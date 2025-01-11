"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataPlans = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../utils/errors");
const getDataPlans = async (req, res, next) => {
    try {
        const { networkId } = req.params;
        if (!networkId) {
            throw new errors_1.BadRequestError('Network ID is required');
        }
        const plans = await db_1.db.query.dataPlans.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dataPlans.networkId, networkId), (0, drizzle_orm_1.eq)(schema_1.dataPlans.isActive, true)),
            orderBy: (plans) => plans.price,
        });
        res.json({
            status: 'success',
            data: plans,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDataPlans = getDataPlans;
