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
exports.purchaseAirtime = void 0;
const transactions_1 = require("../services/wallet/transactions");
const calculator_1 = require("../services/commission/calculator");
const vtpass = __importStar(require("../services/providers/vtpass"));
const gladtidings = __importStar(require("../services/providers/gladtidings"));
const errors_1 = require("../utils/errors");
const validation_1 = require("../utils/validation");
const purchaseAirtime = async (req, res, next) => {
    try {
        const { phone, amount, networkId, provider = 'vtpass' } = req.body;
        if (!(0, validation_1.isValidPhoneNumber)(phone)) {
            throw new errors_1.BadRequestError('Invalid phone number');
        }
        if (!amount || amount <= 0) {
            throw new errors_1.BadRequestError('Invalid amount');
        }
        const sanitizedPhone = (0, validation_1.sanitizePhone)(phone);
        const providerService = provider === 'vtpass' ? vtpass : gladtidings;
        const transaction = await (0, transactions_1.createTransaction)({
            userId: req.user.userId,
            type: 'airtime',
            amount,
            networkId,
            phoneNumber: sanitizedPhone,
            provider,
        });
        const commission = await (0, calculator_1.calculateCommission)({
            userRole: req.user.role,
            networkId,
            serviceType: 'airtime',
            amount,
        });
        const result = await providerService.purchaseAirtime({
            phone: sanitizedPhone,
            amount,
            network: networkId,
        });
        res.json({
            status: 'success',
            data: {
                ...result,
                transactionId: transaction.id,
                commission,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.purchaseAirtime = purchaseAirtime;