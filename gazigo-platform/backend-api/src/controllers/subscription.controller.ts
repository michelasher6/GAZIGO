import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { subscriptionService } from '../services/subscription.service';

export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscription = await subscriptionService.createSubscription({
      customerId: req.user.id,
      ...req.body,
    });

    res.status(201).json(subscription);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMySubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscriptions = await subscriptionService.getCustomerSubscriptions(
      req.user.id
    );

    res.json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const subscription = await subscriptionService.cancelSubscription(
      id,
      req.user.id
    );

    res.json(subscription);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

