import { Request, Response, NextFunction } from 'express';
import { createWithdrawalRequest, getWithdrawalHistory } from '../../services/commission/withdrawal';
import { BadRequestError } from '../../utils/errors';
import { validateWithdrawalAmount } from '../../utils/validation';

export const requestWithdrawal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount } = req.body;
    
    if (!validateWithdrawalAmount(amount)) {
      throw new BadRequestError('Invalid withdrawal amount');
    }

    const withdrawal = await createWithdrawalRequest({
      userId: req.user!.userId,
      amount,
    });

    res.status(201).json({
      status: 'success',
      data: withdrawal,
    });
  } catch (error) {
    next(error);
  }
};

export const getWithdrawals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const history = await getWithdrawalHistory({
      userId: req.user!.userId,
      limit: Number(limit),
      offset: Number(offset),
    });

    res.json({
      status: 'success',
      data: history,
    });
  } catch (error) {
    next(error);
  }
};