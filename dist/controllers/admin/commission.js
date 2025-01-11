"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommissionRate = exports.updateCommissionRate = exports.getCommissionRates = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../utils/errors");
const numeric_1 = require("../../utils/numeric");
const getCommissionRates = async (req, res, next) => {
    try {
        const { userRole, networkId } = req.query;
        let where = undefined;
        if (userRole && networkId) {
            where = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.commissionRates.userRole, userRole), (0, drizzle_orm_1.eq)(schema_1.commissionRates.networkId, networkId));
        }
        else if (userRole) {
            where = (0, drizzle_orm_1.eq)(schema_1.commissionRates.userRole, userRole);
        }
        else if (networkId) {
            where = (0, drizzle_orm_1.eq)(schema_1.commissionRates.networkId, networkId);
        }
        const rates = await db_1.db.query.commissionRates.findMany({ where });
        res.json({
            status: 'success',
            data: rates,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCommissionRates = getCommissionRates;
const updateCommissionRate = async (req, res, next) => {
    try {
        const { rateId } = req.params;
        const { rate } = req.body;
        if (typeof rate !== 'number' || rate < 0 || rate > 100) {
            throw new errors_1.BadRequestError('Invalid commission rate');
        }
        const [updatedRate] = await db_1.db
            .update(schema_1.commissionRates)
            .set({ rate: (0, numeric_1.toNumeric)(rate) })
            .where((0, drizzle_orm_1.eq)(schema_1.commissionRates.id, rateId))
            .returning();
        if (!updatedRate) {
            throw new errors_1.NotFoundError('Commission rate not found');
        }
        res.json({
            status: 'success',
            data: updatedRate,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCommissionRate = updateCommissionRate;
const createCommissionRate = async (req, res, next) => {
    try {
        const { userRole, networkId, serviceType, rate } = req.body;
        if (typeof rate !== 'number' || rate < 0 || rate > 100) {
            throw new errors_1.BadRequestError('Invalid commission rate');
        }
        // Check if rate already exists
        const existingRate = await db_1.db.query.commissionRates.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.commissionRates.userRole, userRole), (0, drizzle_orm_1.eq)(schema_1.commissionRates.networkId, networkId), (0, drizzle_orm_1.eq)(schema_1.commissionRates.serviceType, serviceType)),
        });
        if (existingRate) {
            throw new errors_1.BadRequestError('Commission rate already exists for this configuration');
        }
        const [newRate] = await db_1.db
            .insert(schema_1.commissionRates)
            .values({
            userRole: userRole,
            networkId,
            serviceType,
            rate: (0, numeric_1.toNumeric)(rate),
        })
            .returning();
        res.status(201).json({
            status: 'success',
            data: newRate,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCommissionRate = createCommissionRate;
