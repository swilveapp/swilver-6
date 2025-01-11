"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWithdrawals = exports.requestWithdrawal = void 0;
const withdrawal_1 = require("../../services/commission/withdrawal");
const errors_1 = require("../../utils/errors");
const validation_1 = require("../../utils/validation");
const requestWithdrawal = async (req, res, next) => {
    try {
        const { amount } = req.body;
        if (!(0, validation_1.validateWithdrawalAmount)(amount)) {
            throw new errors_1.BadRequestError('Invalid withdrawal amount');
        }
        const withdrawal = await (0, withdrawal_1.createWithdrawalRequest)({
            userId: req.user.userId,
            amount,
        });
        res.status(201).json({
            status: 'success',
            data: withdrawal,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.requestWithdrawal = requestWithdrawal;
const getWithdrawals = async (req, res, next) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const history = await (0, withdrawal_1.getWithdrawalHistory)({
            userId: req.user.userId,
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
exports.getWithdrawals = getWithdrawals;
