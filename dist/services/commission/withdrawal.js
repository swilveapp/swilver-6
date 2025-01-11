"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWithdrawalHistory = exports.createWithdrawalRequest = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../utils/errors");
const numeric_1 = require("../../utils/numeric");
const createWithdrawalRequest = async ({ userId, amount, }) => {
    const wallet = await db_1.db.query.wallets.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.wallets.userId, userId),
    });
    if (!wallet || (0, numeric_1.parseNumeric)(wallet.commissionBalance) < amount) {
        throw new errors_1.BadRequestError('Insufficient commission balance');
    }
    return db_1.db.transaction(async (tx) => {
        // Create withdrawal transaction
        const [transaction] = await tx
            .insert(schema_1.transactions)
            .values({
            userId,
            type: 'commission_withdrawal',
            amount: (0, numeric_1.toNumeric)(amount),
            status: 'pending',
        })
            .returning();
        // Update wallet commission balance
        await tx
            .update(schema_1.wallets)
            .set({
            commissionBalance: (0, numeric_1.toNumeric)((0, numeric_1.parseNumeric)(wallet.commissionBalance) - amount),
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.wallets.id, wallet.id));
        return transaction;
    });
};
exports.createWithdrawalRequest = createWithdrawalRequest;
const getWithdrawalHistory = async ({ userId, limit, offset, }) => {
    return db_1.db.query.transactions.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.transactions.userId, userId), (0, drizzle_orm_1.eq)(schema_1.transactions.type, 'commission_withdrawal')),
        orderBy: (0, drizzle_orm_1.desc)(schema_1.transactions.createdAt),
        limit,
        offset,
    });
};
exports.getWithdrawalHistory = getWithdrawalHistory;
