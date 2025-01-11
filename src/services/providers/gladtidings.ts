import axios from 'axios';
import { config } from '../../config';

const gladTidingsApi = axios.create({
  baseURL: 'https://gladtidings.com/api',
  headers: {
    'api-key': config.providers.gladtidings.apiKey,
  },
});

export const purchaseAirtime = async ({
  phone,
  amount,
  network,
}: {
  phone: string;
  amount: number;
  network: string;
}) => {
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

export const purchaseData = async ({
  phone,
  network,
  planCode,
}: {
  phone: string;
  network: string;
  planCode: string;
}) => {
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