import { Router } from 'express';
import { getTransactionHistory } from '../controllers/transactions/history';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/history', getTransactionHistory);

export default router;