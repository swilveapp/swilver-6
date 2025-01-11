"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const rate_limit_1 = require("../utils/rate-limit");
const router = (0, express_1.Router)();
const authLimiter = (0, rate_limit_1.createRateLimiter)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later',
});
router.post('/register', auth_1.register);
router.post('/login', authLimiter, auth_1.login);
exports.default = router;
