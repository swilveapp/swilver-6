import { Router } from 'express';
import { purchaseData } from '../controllers/data/purchase';
import { getDataPlans } from '../controllers/data/plans';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/plans/:networkId', getDataPlans);
router.post('/purchase', purchaseData);

export default router;