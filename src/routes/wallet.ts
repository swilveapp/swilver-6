import { Router } from 'express';
import { getBalance, fundWallet } from '../controllers/wallet';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/balance', getBalance);
router.post('/fund', fundWallet);

export default router;