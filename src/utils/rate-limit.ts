import rateLimit from 'express-rate-limit';

export const createRateLimiter = ({
  windowMs,
  max,
  message,
}: {
  windowMs: number;
  max: number;
  message: string;
}) => {
  return rateLimit({
    windowMs,
    max,
    message: { status: 'error', code: 429, message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};