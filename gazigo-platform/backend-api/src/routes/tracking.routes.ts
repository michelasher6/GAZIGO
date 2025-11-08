import { Router } from 'express';
import {
  updateLocation,
  updateStatus,
  getTracking,
} from '../controllers/tracking.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/:id', authenticate, getTracking);
router.patch('/:id/location', authenticate, authorize('driver', 'vendor'), updateLocation);
router.patch('/:id/status', authenticate, authorize('driver', 'vendor', 'admin'), updateStatus);

export default router;

