"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionHistory = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getTransactionHistory = async (req, res, next) => {
    try {
        const { type, limit = 20, offset = 0 } = req.query;
        const userId = req.user.userId;
        const where = type
            ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.transactions.userId, userId), (0, drizzle_orm_1.eq)(schema_1.transactions.type, type))
            : (0, drizzle_orm_1.eq)(schema_1.transactions.userId, userId);
        const history = await db_1.db.query.transactions.findMany({
            where,
            orderBy: (0, drizzle_orm_1.desc)(schema_1.transactions.createdAt),
            limit: Number(limit),
            offset: Number(offset),
        });
        res.json({
            status: 'success',
            data: history,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTransactionHistory = getTransactionHistory;
