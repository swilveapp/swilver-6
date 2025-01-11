"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyPayment = exports.initializePayment = void 0;
const flutterwave = __importStar(require("../services/payment/flutterwave"));
const paystack = __importStar(require("../services/payment/paystack"));
const transactions_1 = require("../services/wallet/transactions");
const errors_1 = require("../utils/errors");
const config_1 = require("../config");
const initializePayment = async (req, res, next) => {
    try {
        const { amount, provider = 'paystack' } = req.body;
        if (!amount || amount <= 0) {
            throw new errors_1.BadRequestError('Invalid amount');
        }
        const reference = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const callbackUrl = `${config_1.config.baseUrl}/payment/callback`;
        const paymentService = provider === 'paystack' ? paystack : flutterwave;
        const payment = await paymentService.initializePayment({
            amount,
            email: req.user.email,
            reference,
            callbackUrl,
        });
        await (0, transactions_1.createTransaction)({
            userId: req.user.userId,
            type: 'wallet_funding',
            amount,
            metadata: JSON.stringify({ provider, reference }),
        });
        res.json({
            status: 'success',
            data: payment,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.initializePayment = initializePayment;
const verifyPayment = async (req, res, next) => {
    try {
        const { reference, provider = 'paystack' } = req.query;
        if (!reference) {
            throw new errors_1.BadRequestError('Reference is required');
        }
        const paymentService = provider === 'paystack' ? paystack : flutterwave;
        const verification = await paymentService.verifyPayment(reference);
        res.json({
            status: 'success',
            data: verification,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyPayment = verifyPayment;
const handleWebhook = async (req, res, next) => {
    try {
        const provider = req.params.provider;
        const signature = provider === 'paystack'
            ? req.headers['x-paystack-signature']
            : req.headers['verif-hash'];
        if (!signature) {
            throw new errors_1.BadRequestError('Invalid webhook signature');
        }
        const paymentService = provider === 'paystack' ? paystack : flutterwave;
        const isValid = paymentService.verifyWebhook(signature, req.body);
        if (!isValid) {
            throw new errors_1.BadRequestError('Invalid webhook signature');
        }
        // Process the webhook based on provider
        // Update transaction status and wallet balance
        // Send notifications if needed
        res.json({ status: 'success' });
    }
    catch (error) {
        next(error);
    }
};
exports.handleWebhook = handleWebhook;
