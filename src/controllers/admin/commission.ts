import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { commissionRates } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { UserRole } from '../../types';
import { toNumeric } from '../../utils/numeric';

export const getCommissionRates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userRole, networkId } = req.query;
    
    let where = undefined;
    if (userRole && networkId) {
      where = and(
        eq(commissionRates.userRole, userRole as UserRole),
        eq(commissionRates.networkId, networkId as string)
      );
    } else if (userRole) {
      where = eq(commissionRates.userRole, userRole as UserRole);
    } else if (networkId) {
      where = eq(commissionRates.networkId, networkId as string);
    }

    const rates = await db.query.commissionRates.findMany({ where });

    res.json({
      status: 'success',
      data: rates,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCommissionRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rateId } = req.params;
    const { rate } = req.body;

    if (typeof rate !== 'number' || rate < 0 || rate > 100) {
      throw new BadRequestError('Invalid commission rate');
    }

    const [updatedRate] = await db
      .update(commissionRates)
      .set({ rate: toNumeric(rate) })
      .where(eq(commissionRates.id, rateId))
      .returning();

    if (!updatedRate) {
      throw new NotFoundError('Commission rate not found');
    }

    res.json({
      status: 'success',
      data: updatedRate,
    });
  } catch (error) {
    next(error);
  }
};

export const createCommissionRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userRole, networkId, serviceType, rate } = req.body;

    if (typeof rate !== 'number' || rate < 0 || rate > 100) {
      throw new BadRequestError('Invalid commission rate');
    }

    // Check if rate already exists
    const existingRate = await db.query.commissionRates.findFirst({
      where: and(
        eq(commissionRates.userRole, userRole as UserRole),
        eq(commissionRates.networkId, networkId),
        eq(commissionRates.serviceType, serviceType)
      ),
    });

    if (existingRate) {
      throw new BadRequestError('Commission rate already exists for this configuration');
    }

    const [newRate] = await db
      .insert(commissionRates)
      .values({
        userRole: userRole as UserRole,
        networkId,
        serviceType,
        rate: toNumeric(rate),
      })
      .returning();

    res.status(201).json({
      status: 'success',
      data: newRate,
    });
  } catch (error) {
    next(error);
  }
};