import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { transactions } from '../../db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { TransactionType } from '../../types';

export const getTransactionStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    let where = undefined;
    if (startDate && endDate) {
      where = and(
        gte(transactions.createdAt, new Date(startDate as string)),
        lte(transactions.createdAt, new Date(endDate as string))
      );
      if (type) {
        where = and(where, eq(transactions.type, type as TransactionType));
      }
    } else if (type) {
      where = eq(transactions.type, type as TransactionType);
    }

    const stats = await db.query.transactions.findMany({
      where,
      columns: {
        type: true,
        status: true,
        amount: true,
        fee: true,
        commission: true,
        createdAt: true,
      },
    });

    // Calculate summary statistics
    const summary = stats.reduce((acc, curr) => {
      acc.totalAmount += parseFloat(curr.amount);
      acc.totalFee += parseFloat(curr.fee);
      acc.totalCommission += parseFloat(curr.commission);
      acc.count += 1;
      return acc;
    }, {
      totalAmount: 0,
      totalFee: 0,
      totalCommission: 0,
      count: 0,
    });

    res.json({
      status: 'success',
      data: {
        summary,
        transactions: stats,
      },
    });
  } catch (error) {
    next(error);
  }
};