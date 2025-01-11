import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { transactions } from '../../db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { TransactionType } from '../../types';

export const getTransactionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, limit = 20, offset = 0 } = req.query;
    const userId = req.user!.userId;

    const where = type
      ? and(eq(transactions.userId, userId), eq(transactions.type, type as TransactionType))
      : eq(transactions.userId, userId);

    const history = await db.query.transactions.findMany({
      where,
      orderBy: desc(transactions.createdAt),
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