import { Router } from 'express';
import {
  createSubscription,
  getMySubscriptions,
  cancelSubscription,
} from '../controllers/subscription.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('customer'), createSubscription);
router.get('/', authenticate, authorize('customer'), getMySubscriptions);
router.delete('/:id', authenticate, authorize('customer'), cancelSubscription);

export default router;

