"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_1 = require("../controllers/wallet");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/balance', wallet_1.getBalance);
router.post('/fund', wallet_1.fundWallet);
exports.default = router;