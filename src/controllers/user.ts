import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { isValidEmail } from '../utils/validation';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user!.userId),
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { password, apiSecret, ...profile } = user;

    res.json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, fullName, phone } = req.body;

    if (email && !isValidEmail(email)) {
      throw new BadRequestError('Invalid email format');
    }

    const [user] = await db
      .update(users)
      .set({
        ...(email && { email }),
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user!.userId))
      .returning();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { password, apiSecret, ...profile } = user;

    res.json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};