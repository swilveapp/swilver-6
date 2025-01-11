import { Router } from 'express';
import { register, login } from '../controllers/auth';
import { createRateLimiter } from '../utils/rate-limit';

const router = Router();

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later',
});

router.post('/register', register);
router.post('/login', authLimiter, login);

export default router;