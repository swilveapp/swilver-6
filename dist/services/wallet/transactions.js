"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../utils/errors");
const numeric_1 = require("../../utils/numeric");
const createTransaction = async ({ userId, type, amount, networkId, dataPlanId, phoneNumber, provider, metadata, }) => {
    const wallet = await db_1.db.query.wallets.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.wallets.userId, userId),
    });
    if (!wallet) {
        throw new errors_1.NotFoundError('Wallet not found');
    }
    const currentBalance = (0, numeric_1.parseNumeric)(wallet.balance);
    if (currentBalance < amount) {
        throw new Error('Insufficient balance');
    }
    return db_1.db.transaction(async (tx) => {
        // Create transaction record
        const [transaction] = await tx
            .insert(schema_1.transactions)
            .values({
            userId,
            type,
            amount: (0, numeric_1.toNumeric)(amount),
            networkId,
            dataPlanId,
            phoneNumber,
            provider,
            metadata,
        })
            .returning();
        // Update wallet balance
        await tx
            .update(schema_1.wallets)
            .set({
            balance: (0, numeric_1.toNumeric)(currentBalance - amount),
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.wallets.id, wallet.id));
        return transaction;
    });
};
exports.createTransaction = createTransaction;
