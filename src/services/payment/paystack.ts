import axios from 'axios';
import crypto from 'crypto';
import { config } from '../../config';

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    'Authorization': `Bearer ${config.payment.paystack.secretKey}`,
    'Content-Type': 'application/json',
  },
});

export const initializePayment = async ({
  amount,
  email,
  reference,
  callbackUrl,
}: {
  amount: number;
  email: string;
  reference: string;
  callbackUrl: string;
}) => {
  const response = await paystackApi.post('/transaction/initialize', {
    amount: amount * 100, // Paystack expects amount in kobo
    email,
    reference,
    callback_url: callbackUrl,
  });

  return response.data;
};

export const verifyPayment = async (reference: string) => {
  const response = await paystackApi.get(`/transaction/verify/${reference}`);
  return response.data;
};

export const verifyWebhook = (signature: string, payload: any) => {
  const hash = crypto
    .createHmac('sha512', config.payment.paystack.webhookSecret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return hash === signature;
};