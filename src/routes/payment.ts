import { Router } from 'express';
import { initializePayment, verifyPayment, handleWebhook } from '../controllers/payment';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protected routes
router.use(authenticate);
router.post('/initialize', initializePayment);
router.get('/verify', verifyPayment);

// Webhook endpoints (public)
router.post('/webhook/paystack', handleWebhook);
router.post('/webhook/flutterwave', handleWebhook);

export default router;