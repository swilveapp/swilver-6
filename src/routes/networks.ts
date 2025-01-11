import { Router } from 'express';
import { getNetworks } from '../controllers/networks';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getNetworks);

export default router;