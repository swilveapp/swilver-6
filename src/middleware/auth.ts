import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth/token';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { AuthUser, UserRole } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = {
      ...decoded,
      role: decoded.role as UserRole, // Cast the role to UserRole type
      email: '', // Add a default empty email since it's required by AuthUser type
    };
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError());
    }

    next();
  };
};