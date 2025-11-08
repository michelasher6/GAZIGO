import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { trackingService } from '../services/tracking.service';

export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { lat, lng } = req.body;

    const delivery = await trackingService.updateDeliveryLocation(id, lat, lng);
    res.json(delivery);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const delivery = await trackingService.updateDeliveryStatus(id, status);
    res.json(delivery);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTracking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const tracking = await trackingService.getDeliveryTracking(id);
    
    if (!tracking) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    res.json(tracking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

