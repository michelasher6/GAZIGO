import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { orderService } from '../services/order.service';
import { z } from 'zod';

const createOrderSchema = z.object({
  body: z.object({
    cylinderType: z.enum(['6kg', '12kg', '15kg', '20kg']),
    orderType: z.enum(['new', 'exchange']),
    quantity: z.number().int().positive().default(1),
    deliveryAddressId: z.string().uuid(),
    paymentMethod: z.enum(['mobile_money_mtn', 'mobile_money_orange', 'cash']),
  }),
});

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const order = await orderService.createOrder({
      customerId: req.user.id,
      ...req.body,
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const order = await orderService.getOrderById(id, req.user.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const orders = await orderService.getOrdersByCustomer(
      req.user.id,
      limit,
      offset
    );

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status, vendorId } = req.body;

    const order = await orderService.updateOrderStatus(
      id,
      status,
      vendorId || req.user.id
    );

    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

