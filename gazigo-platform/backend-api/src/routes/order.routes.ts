import { Router } from 'express';
import {
  createOrder,
  getOrder,
  getMyOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const createOrderSchema = z.object({
  body: z.object({
    cylinderType: z.enum(['6kg', '12kg', '15kg', '20kg']),
    orderType: z.enum(['new', 'exchange']),
    quantity: z.number().int().positive().default(1),
    deliveryAddressId: z.string().uuid(),
    paymentMethod: z.enum(['mobile_money_mtn', 'mobile_money_orange', 'cash']),
  }),
});

// Customer routes
router.post(
  '/',
  authenticate,
  authorize('customer'),
  validate(createOrderSchema),
  createOrder
);
router.get('/', authenticate, authorize('customer'), getMyOrders);
router.get('/:id', authenticate, getOrder);

// Vendor/Admin routes
router.patch(
  '/:id/status',
  authenticate,
  authorize('vendor', 'admin'),
  updateOrderStatus
);

export default router;

