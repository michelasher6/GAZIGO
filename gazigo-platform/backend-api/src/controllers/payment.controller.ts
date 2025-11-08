import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { paymentService } from '../services/payment.service';
import { z } from 'zod';

const processPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    amount: z.number().positive(),
    method: z.enum(['mobile_money_mtn', 'mobile_money_orange', 'cash']),
    phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/),
  }),
});

export const processPayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payment = await paymentService.processPayment(req.body);
    res.status(201).json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const payment = await paymentService.updatePaymentStatus(id, status);
    res.json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

