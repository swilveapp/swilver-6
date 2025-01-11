import { Request, Response, NextFunction } from 'express';
import * as flutterwave from '../services/payment/flutterwave';
import * as paystack from '../services/payment/paystack';
import { createTransaction } from '../services/wallet/transactions';
import { BadRequestError } from '../utils/errors';
import { config } from '../config';

export const initializePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, provider = 'paystack' } = req.body;

    if (!amount || amount <= 0) {
      throw new BadRequestError('Invalid amount');
    }

    const reference = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const callbackUrl = `${config.baseUrl}/payment/callback`;

    const paymentService = provider === 'paystack' ? paystack : flutterwave;
    const payment = await paymentService.initializePayment({
      amount,
      email: req.user!.email,
      reference,
      callbackUrl,
    });

    await createTransaction({
      userId: req.user!.userId,
      type: 'wallet_funding',
      amount,
      metadata: JSON.stringify({ provider, reference }),
    });

    res.json({
      status: 'success',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reference, provider = 'paystack' } = req.query;

    if (!reference) {
      throw new BadRequestError('Reference is required');
    }

    const paymentService = provider === 'paystack' ? paystack : flutterwave;
    const verification = await paymentService.verifyPayment(reference as string);

    res.json({
      status: 'success',
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const provider = req.params.provider;
    const signature = provider === 'paystack' 
      ? req.headers['x-paystack-signature'] as string
      : req.headers['verif-hash'] as string;

    if (!signature) {
      throw new BadRequestError('Invalid webhook signature');
    }

    const paymentService = provider === 'paystack' ? paystack : flutterwave;
    const isValid = paymentService.verifyWebhook(signature, req.body);

    if (!isValid) {
      throw new BadRequestError('Invalid webhook signature');
    }

    // Process the webhook based on provider
    // Update transaction status and wallet balance
    // Send notifications if needed

    res.json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};