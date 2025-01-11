"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseData = exports.purchaseAirtime = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const gladTidingsApi = axios_1.default.create({
    baseURL: 'https://gladtidings.com/api',
    headers: {
        'api-key': config_1.config.providers.gladtidings.apiKey,
    },
});
const purchaseAirtime = async ({ phone, amount, network, }) => {
    const response = await gladTidingsApi.post('/vend/airtime', {
        network,
        amount,
        phone,
        reference: Date.now().toString(),
    });
    return {
        success: response.data.status === 'success',
        reference: response.data.reference,
        message: response.data.message,
    };
};
exports.purchaseAirtime = purchaseAirtime;
const purchaseData = async ({ phone, network, planCode, }) => {
    const response = await gladTidingsApi.post('/vend/data', {
        network,
        plan: planCode,
        phone,
        reference: Date.now().toString(),
    });
    return {
        success: response.data.status === 'success',
        reference: response.data.reference,
        message: response.data.message,
    };
};
exports.purchaseData = purchaseData;
