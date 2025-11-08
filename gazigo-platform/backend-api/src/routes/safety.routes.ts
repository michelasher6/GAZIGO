import { Router } from 'express';
import {
  createSafetyRecord,
  getSafetyRecords,
  getVendorCompliance,
} from '../controllers/safety.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin', 'safety'),
  createSafetyRecord
);
router.get('/', authenticate, getSafetyRecords);
router.get('/vendor/:vendorId', authenticate, getVendorCompliance);

export default router;

