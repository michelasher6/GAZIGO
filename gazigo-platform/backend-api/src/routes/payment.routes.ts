import { Router } from 'express';
import { processPayment, updatePaymentStatus } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, processPayment);
router.patch('/:id/status', authenticate, authorize('admin', 'vendor'), updatePaymentStatus);

export default router;

