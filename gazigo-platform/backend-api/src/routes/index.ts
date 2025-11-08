import { Router } from 'express';
import authRoutes from './auth.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import trackingRoutes from './tracking.routes';
import subscriptionRoutes from './subscription.routes';
import safetyRoutes from './safety.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/tracking', trackingRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/safety', safetyRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

