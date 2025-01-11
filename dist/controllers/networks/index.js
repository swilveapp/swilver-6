"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworks = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getNetworks = async (req, res, next) => {
    try {
        const activeNetworks = await db_1.db.query.networks.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.networks.isActive, true),
        });
        res.json({
            status: 'success',
            data: activeNetworks,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getNetworks = getNetworks;
