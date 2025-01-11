import { Request, Response, NextFunction } from 'express';
import { hashPassword, verifyPassword } from '../services/auth/password';
import { generateToken, generateApiCredentials } from '../services/auth/token';
import { db } from '../db';
import { users, wallets } from '../db/schema';
import { eq } from 'drizzle-orm';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { isValidEmail } from '../utils/validation';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, fullName, phone, role = 'reseller' } = req.body;

    if (!isValidEmail(email)) {
      throw new BadRequestError('Invalid email format');
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const apiCreds = role === 'api_user' ? generateApiCredentials() : {};

    const [user] = await db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          fullName,
          phone,
          role,
          ...apiCreds,
        })
        .returning();

      await tx.insert(wallets).values({
        userId: newUser.id,
      });

      return [newUser];
    });

    const token = generateToken({ userId: user.id, role: user.role });

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          ...(role === 'api_user' ? apiCreds : {}),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({ userId: user.id, role: user.role });

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};