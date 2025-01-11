"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../utils/errors");
const validation_1 = require("../utils/validation");
const getProfile = async (req, res, next) => {
    try {
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, req.user.userId),
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const { password, apiSecret, ...profile } = user;
        res.json({
            status: 'success',
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const { email, fullName, phone } = req.body;
        if (email && !(0, validation_1.isValidEmail)(email)) {
            throw new errors_1.BadRequestError('Invalid email format');
        }
        const [user] = await db_1.db
            .update(schema_1.users)
            .set({
            ...(email && { email }),
            ...(fullName && { fullName }),
            ...(phone && { phone }),
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, req.user.userId))
            .returning();
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const { password, apiSecret, ...profile } = user;
        res.json({
            status: 'success',
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
