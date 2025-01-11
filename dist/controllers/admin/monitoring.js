"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionStats = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getTransactionStats = async (req, res, next) => {
    try {
        const { startDate, endDate, type } = req.query;
        let where = undefined;
        if (startDate && endDate) {
            where = (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.transactions.createdAt, new Date(startDate)), (0, drizzle_orm_1.lte)(schema_1.transactions.createdAt, new Date(endDate)));
            if (type) {
                where = (0, drizzle_orm_1.and)(where, (0, drizzle_orm_1.eq)(schema_1.transactions.type, type));
            }
        }
        else if (type) {
            where = (0, drizzle_orm_1.eq)(schema_1.transactions.type, type);
        }
        const stats = await db_1.db.query.transactions.findMany({
            where,
            columns: {
                type: true,
                status: true,
                amount: true,
                fee: true,
                commission: true,
                createdAt: true,
            },
        });
        // Calculate summary statistics
        const summary = stats.reduce((acc, curr) => {
            acc.totalAmount += parseFloat(curr.amount);
            acc.totalFee += parseFloat(curr.fee);
            acc.totalCommission += parseFloat(curr.commission);
            acc.count += 1;
            return acc;
        }, {
            totalAmount: 0,
            totalFee: 0,
            totalCommission: 0,
            count: 0,
        });
        res.json({
            status: 'success',
            data: {
                summary,
                transactions: stats,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTransactionStats = getTransactionStats;
