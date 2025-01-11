import { Router } from 'express';
import { getUsers } from '../controllers/admin/users';
import { getCommissionRates, updateCommissionRate, createCommissionRate } from '../controllers/admin/commission';
import { getTransactionStats } from '../controllers/admin/monitoring';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['admin']));

// User management
router.get('/users', getUsers);

// Commission management
router.get('/commission-rates', getCommissionRates);
router.post('/commission-rates', createCommissionRate);
router.patch('/commission-rates/:rateId', updateCommissionRate);

// Monitoring
router.get('/stats/transactions', getTransactionStats);

export default router;