"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletBalance = exports.getWalletBalance = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../utils/errors");
const numeric_1 = require("../../utils/numeric");
const getWalletBalance = async (userId) => {
    const wallet = await db_1.db.query.wallets.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.wallets.userId, userId),
    });
    if (!wallet) {
        throw new errors_1.NotFoundError('Wallet not found');
    }
    return {
        balance: wallet.balance,
        commissionBalance: wallet.commissionBalance,
    };
};
exports.getWalletBalance = getWalletBalance;
const updateWalletBalance = async (userId, amount, type) => {
    const wallet = await db_1.db.query.wallets.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.wallets.userId, userId),
    });
    if (!wallet) {
        throw new errors_1.NotFoundError('Wallet not found');
    }
    const currentBalance = (0, numeric_1.parseNumeric)(wallet.balance);
    const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount;
    if (newBalance < 0) {
        throw new Error('Insufficient balance');
    }
    await db_1.db
        .update(schema_1.wallets)
        .set({
        balance: (0, numeric_1.toNumeric)(newBalance),
        lastFundedAt: type === 'credit' ? new Date() : undefined,
        updatedAt: new Date()
    })
        .where((0, drizzle_orm_1.eq)(schema_1.wallets.id, wallet.id));
    return { balance: (0, numeric_1.toNumeric)(newBalance) };
};
exports.updateWalletBalance = updateWalletBalance;
