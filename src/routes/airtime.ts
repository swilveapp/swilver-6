import { Router } from 'express';
import { purchaseAirtime } from '../controllers/airtime';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/purchase', purchaseAirtime);

export default router;