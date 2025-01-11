import { Request, Response, NextFunction } from 'express';
import { getWalletBalance, updateWalletBalance } from '../services/wallet/balance';
import { createTransaction } from '../services/wallet/transactions';
import { BadRequestError } from '../utils/errors';

export const getBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const balance = await getWalletBalance(req.user!.userId);
    res.json({
      status: 'success',
      data: balance,
    });
  } catch (error) {
    next(error);
  }
};

export const fundWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, reference } = req.body;

    if (!amount || amount <= 0) {
      throw new BadRequestError('Invalid amount');
    }

    await createTransaction({
      userId: req.user!.userId,
      type: 'wallet_funding',
      amount,
    });

    const balance = await updateWalletBalance(req.user!.userId, amount, 'credit');

    res.json({
      status: 'success',
      data: {
        ...balance,
        reference,
      },
    });
  } catch (error) {
    next(error);
  }
};