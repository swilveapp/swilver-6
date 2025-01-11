"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebhook = exports.verifyPayment = exports.initializePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../../config");
const paystackApi = axios_1.default.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        'Authorization': `Bearer ${config_1.config.payment.paystack.secretKey}`,
        'Content-Type': 'application/json',
    },
});
const initializePayment = async ({ amount, email, reference, callbackUrl, }) => {
    const response = await paystackApi.post('/transaction/initialize', {
        amount: amount * 100, // Paystack expects amount in kobo
        email,
        reference,
        callback_url: callbackUrl,
    });
    return response.data;
};
exports.initializePayment = initializePayment;
const verifyPayment = async (reference) => {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    return response.data;
};
exports.verifyPayment = verifyPayment;
const verifyWebhook = (signature, payload) => {
    const hash = crypto_1.default
        .createHmac('sha512', config_1.config.payment.paystack.webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');
    return hash === signature;
};
exports.verifyWebhook = verifyWebhook;
