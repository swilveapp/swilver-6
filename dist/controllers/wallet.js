"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundWallet = exports.getBalance = void 0;
const balance_1 = require("../services/wallet/balance");
const transactions_1 = require("../services/wallet/transactions");
const errors_1 = require("../utils/errors");
const getBalance = async (req, res, next) => {
    try {
        const balance = await (0, balance_1.getWalletBalance)(req.user.userId);
        res.json({
            status: 'success',
            data: balance,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBalance = getBalance;
const fundWallet = async (req, res, next) => {
    try {
        const { amount, reference } = req.body;
        if (!amount || amount <= 0) {
            throw new errors_1.BadRequestError('Invalid amount');
        }
        await (0, transactions_1.createTransaction)({
            userId: req.user.userId,
            type: 'wallet_funding',
            amount,
        });
        const balance = await (0, balance_1.updateWalletBalance)(req.user.userId, amount, 'credit');
        res.json({
            status: 'success',
            data: {
                ...balance,
                reference,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.fundWallet = fundWallet;
