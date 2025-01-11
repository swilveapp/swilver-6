"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseData = exports.purchaseAirtime = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const vtpassApi = axios_1.default.create({
    baseURL: 'https://vtpass.com/api',
    headers: {
        'api-key': config_1.config.providers.vtpass.apiKey,
        'secret-key': config_1.config.providers.vtpass.secretKey,
    },
});
const purchaseAirtime = async ({ phone, amount, network, }) => {
    const response = await vtpassApi.post('/pay', {
        serviceID: network,
        amount,
        phone,
        request_id: Date.now().toString(),
        variation_code: 'airtime',
    });
    return {
        success: response.data.code === '000',
        reference: response.data.requestId,
        message: response.data.response_description,
    };
};
exports.purchaseAirtime = purchaseAirtime;
const purchaseData = async ({ phone, network, planCode, }) => {
    const response = await vtpassApi.post('/pay', {
        serviceID: network,
        phone,
        variation_code: planCode,
        request_id: Date.now().toString(),
    });
    return {
        success: response.data.code === '000',
        reference: response.data.requestId,
        message: response.data.response_description,
    };
};
exports.purchaseData = purchaseData;
