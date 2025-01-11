"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApiCredentials = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const crypto_1 = __importDefault(require("crypto"));
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, {
        expiresIn: config_1.config.jwt.expiresIn,
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
};
exports.verifyToken = verifyToken;
const generateApiCredentials = () => {
    const apiKey = crypto_1.default.randomBytes(32).toString('hex');
    const apiSecret = crypto_1.default.randomBytes(32).toString('hex');
    return { apiKey, apiSecret };
};
exports.generateApiCredentials = generateApiCredentials;
