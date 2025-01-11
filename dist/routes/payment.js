"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_1 = require("../controllers/payment");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protected routes
router.use(auth_1.authenticate);
router.post('/initialize', payment_1.initializePayment);
router.get('/verify', payment_1.verifyPayment);
// Webhook endpoints (public)
router.post('/webhook/paystack', payment_1.handleWebhook);
router.post('/webhook/flutterwave', payment_1.handleWebhook);
exports.default = router;
