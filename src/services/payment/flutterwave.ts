import axios from 'axios';
import { config } from '../../config';

const flutterwaveApi = axios.create({
  baseURL: 'https://api.flutterwave.com/v3',
  headers: {
    'Authorization': `Bearer ${config.payment.flutterwave.secretKey}`,
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

export const verifyPayment = async (transactionId: string) => {
  const response = await flutterwaveApi.get(`/transactions/${transactionId}/verify`);
  return response.data;
};

export const verifyWebhook = (signature: string, payload: any) => {
  const secretHash = config.payment.flutterwave.webhookSecret;
  return signature === secretHash;
};