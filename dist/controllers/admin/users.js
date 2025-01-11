"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getUsers = async (req, res, next) => {
    try {
        const { role, limit = 20, offset = 0 } = req.query;
        const where = role ? (0, drizzle_orm_1.eq)(schema_1.users.role, role) : undefined;
        const userList = await db_1.db.query.users.findMany({
            where,
            limit: Number(limit),
            offset: Number(offset),
        });
        // Remove sensitive information
        const sanitizedUsers = userList.map(({ password, apiSecret, ...user }) => user);
        res.json({
            status: 'success',
            data: sanitizedUsers,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
