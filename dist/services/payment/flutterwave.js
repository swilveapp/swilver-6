"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebhook = exports.verifyPayment = exports.initializePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const flutterwaveApi = axios_1.default.create({
    baseURL: 'https://api.flutterwave.com/v3',
    headers: {
        'Authorization': `Bearer ${config_1.config.payment.flutterwave.secretKey}`,
        'Content-Type': 'application/json',
    },
});
const initializePayment = async ({ amount, email, reference, callbackUrl, }) => {
    const response = await flutterwaveApi.post('/payments', {
        tx_ref: reference,
        amount,
        currency: 'NGN',
        redirect_url: callbackUrl,
        customer: {
            email,
        },
        customizations: {
            title: 'Wallet Funding',
            description: 'Fund your VTU wallet',
        },
    });
    return response.data;
};
exports.initializePayment = initializePayment;
const verifyPayment = async (transactionId) => {
    const response = await flutterwaveApi.get(`/transactions/${transactionId}/verify`);
    return response.data;
};
exports.verifyPayment = verifyPayment;
const verifyWebhook = (signature, payload) => {
    const secretHash = config_1.config.payment.flutterwave.webhookSecret;
    return signature === secretHash;
};
exports.verifyWebhook = verifyWebhook;
