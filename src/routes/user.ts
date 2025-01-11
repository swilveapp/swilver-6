import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

export default router;