import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { dataPlans } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { BadRequestError } from '../../utils/errors';

export const getDataPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { networkId } = req.params;
    if (!networkId) {
      throw new BadRequestError('Network ID is required');
    }

    const plans = await db.query.dataPlans.findMany({
      where: and(
        eq(dataPlans.networkId, networkId),
        eq(dataPlans.isActive, true)
      ),
      orderBy: (plans) => plans.price,
    });

    res.json({
      status: 'success',
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};