import axios from 'axios';
import { config } from '../../config';

const vtpassApi = axios.create({
  baseURL: 'https://vtpass.com/api',
  headers: {
    'api-key': config.providers.vtpass.apiKey,
    'secret-key': config.providers.vtpass.secretKey,
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

export const purchaseData = async ({
  phone,
  network,
  planCode,
}: {
  phone: string;
  network: string;
  planCode: string;
}) => {
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