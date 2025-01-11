import { Request, Response, NextFunction } from 'express';
import { createTransaction } from '../services/wallet/transactions';
import { calculateCommission } from '../services/commission/calculator';
import * as vtpass from '../services/providers/vtpass';
import * as gladtidings from '../services/providers/gladtidings';
import { BadRequestError } from '../utils/errors';
import { isValidPhoneNumber, sanitizePhone } from '../utils/validation';

export const purchaseAirtime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, amount, networkId, provider = 'vtpass' } = req.body;

    if (!isValidPhoneNumber(phone)) {
      throw new BadRequestError('Invalid phone number');
    }

    if (!amount || amount <= 0) {
      throw new BadRequestError('Invalid amount');
    }

    const sanitizedPhone = sanitizePhone(phone);
    const providerService = provider === 'vtpass' ? vtpass : gladtidings;

    const transaction = await createTransaction({
      userId: req.user!.userId,
      type: 'airtime',
      amount,
      networkId,
      phoneNumber: sanitizedPhone,
      provider,
    });

    const commission = await calculateCommission({
      userRole: req.user!.role,
      networkId,
      serviceType: 'airtime',
      amount,
    });

    const result = await providerService.purchaseAirtime({
      phone: sanitizedPhone,
      amount,
      network: networkId,
    });

    res.json({
      status: 'success',
      data: {
        ...result,
        transactionId: transaction.id,
        commission,
      },
    });
  } catch (error) {
    next(error);
  }
};