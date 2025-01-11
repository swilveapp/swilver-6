import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { networks } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const getNetworks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activeNetworks = await db.query.networks.findMany({
      where: eq(networks.isActive, true),
    });

    res.json({
      status: 'success',
      data: activeNetworks,
    });
  } catch (error) {
    next(error);
  }
};