"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000'),
    DATABASE_URL: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string().default('24h'),
    VTPASS_API_KEY: zod_1.z.string(),
    VTPASS_SECRET_KEY: zod_1.z.string(),
    GLADTIDINGS_API_KEY: zod_1.z.string(),
    REDIS_URL: zod_1.z.string().optional(),
    SMS_API_KEY: zod_1.z.string(),
    PAYSTACK_SECRET_KEY: zod_1.z.string(),
    PAYSTACK_WEBHOOK_SECRET: zod_1.z.string(),
    FLUTTERWAVE_SECRET_KEY: zod_1.z.string(),
    FLUTTERWAVE_WEBHOOK_SECRET: zod_1.z.string(),
    BASE_URL: zod_1.z.string().default('http://localhost:3000'),
});
const env = envSchema.parse(process.env);
exports.config = {
    env: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    baseUrl: env.BASE_URL,
    database: {
        url: env.DATABASE_URL,
    },
    jwt: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
    },
    providers: {
        vtpass: {
            apiKey: env.VTPASS_API_KEY,
            secretKey: env.VTPASS_SECRET_KEY,
        },
        gladtidings: {
            apiKey: env.GLADTIDINGS_API_KEY,
        },
    },
    redis: {
        url: env.REDIS_URL,
    },
    sms: {
        apiKey: env.SMS_API_KEY,
    },
    payment: {
        paystack: {
            secretKey: env.PAYSTACK_SECRET_KEY,
            webhookSecret: env.PAYSTACK_WEBHOOK_SECRET,
        },
        flutterwave: {
            secretKey: env.FLUTTERWAVE_SECRET_KEY,
            webhookSecret: env.FLUTTERWAVE_WEBHOOK_SECRET,
        },
    },
};
