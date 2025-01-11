"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const withdrawal_1 = require("../controllers/commission/withdrawal");
const auth_1 = require("../middleware/auth");
const rate_limit_1 = require("../utils/rate-limit");
const router = (0, express_1.Router)();
const withdrawalLimiter = (0, rate_limit_1.createRateLimiter)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 withdrawal requests per hour
    message: 'Too many withdrawal requests, please try again later',
});
router.use(auth_1.authenticate);
router.post('/withdraw', withdrawalLimiter, withdrawal_1.requestWithdrawal);
router.get('/withdrawals', withdrawal_1.getWithdrawals);
exports.default = router;
