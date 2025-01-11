import { Router } from 'express';
import { requestWithdrawal, getWithdrawals } from '../controllers/commission/withdrawal';
import { authenticate } from '../middleware/auth';
import { createRateLimiter } from '../utils/rate-limit';

const router = Router();

const withdrawalLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 withdrawal requests per hour
  message: 'Too many withdrawal requests, please try again later',
});

router.use(authenticate);

router.post('/withdraw', withdrawalLimiter, requestWithdrawal);
router.get('/withdrawals', getWithdrawals);

export default router;