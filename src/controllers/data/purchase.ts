import { Request, Response, NextFunction } from 'express';
import { createTransaction } from '../../services/wallet/transactions';
import { calculateCommission } from '../../services/commission/calculator';
import * as vtpass from '../../services/providers/vtpass';
import * as gladtidings from '../../services/providers/gladtidings';
import { BadRequestError } from '../../utils/errors';
import { isValidPhoneNumber, sanitizePhone } from '../../utils/validation';
import { db } from '../../db';
import { dataPlans } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { parseNumeric } from '../../utils/numeric';

export const purchaseData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, planId, networkId, provider = 'vtpass' } = req.body;

    if (!isValidPhoneNumber(phone)) {
      throw new BadRequestError('Invalid phone number');
    }

    const plan = await db.query.dataPlans.findFirst({
      where: and(
        eq(dataPlans.id, planId),
        eq(dataPlans.networkId, networkId),
        eq(dataPlans.isActive, true)
      ),
    });

    if (!plan) {
      throw new BadRequestError('Invalid or inactive data plan');
    }

    const sanitizedPhone = sanitizePhone(phone);
    const providerService = provider === 'vtpass' ? vtpass : gladtidings;
    const planPrice = parseNumeric(plan.price);

    const transaction = await createTransaction({
      userId: req.user!.userId,
      type: 'data',
      amount: planPrice,
      networkId,
      dataPlanId: planId,
      phoneNumber: sanitizedPhone,
      provider,
    });

    const commission = await calculateCommission({
      userRole: req.user!.role,
      networkId,
      serviceType: 'data',
      amount: planPrice,
    });

    const result = await providerService.purchaseData({
      phone: sanitizedPhone,
      network: networkId,
      planCode: plan.code,
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