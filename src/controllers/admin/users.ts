import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { UserRole } from '../../types';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, limit = 20, offset = 0 } = req.query;
    
    const where = role ? eq(users.role, role as UserRole) : undefined;
    
    const userList = await db.query.users.findMany({
      where,
      limit: Number(limit),
      offset: Number(offset),
    });

    // Remove sensitive information
    const sanitizedUsers = userList.map(({ password, apiSecret, ...user }) => user);

    res.json({
      status: 'success',
      data: sanitizedUsers,
    });
  } catch (error) {
    next(error);
  }
};