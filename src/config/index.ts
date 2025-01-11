import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('24h'),
  VTPASS_API_KEY: z.string(),
  VTPASS_SECRET_KEY: z.string(),
  GLADTIDINGS_API_KEY: z.string(),
  REDIS_URL: z.string().optional(),
  SMS_API_KEY: z.string(),
  PAYSTACK_SECRET_KEY: z.string(),
  PAYSTACK_WEBHOOK_SECRET: z.string(),
  FLUTTERWAVE_SECRET_KEY: z.string(),
  FLUTTERWAVE_WEBHOOK_SECRET: z.string(),
  BASE_URL: z.string().default('http://localhost:3000'),
});

const env = envSchema.parse(process.env);

export const config = {
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
} as const;