import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { safetyService } from '../services/safety.service';

export const createSafetyRecord = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const record = await safetyService.createSafetyRecord(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getSafetyRecords = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const filters = {
      orderId: req.query.orderId as string | undefined,
      vendorId: req.query.vendorId as string | undefined,
      isCompliant:
        req.query.isCompliant === 'true'
          ? true
          : req.query.isCompliant === 'false'
          ? false
          : undefined,
    };

    const records = await safetyService.getSafetyRecords(filters);
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getVendorCompliance = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { vendorId } = req.params;
    const compliance = await safetyService.getVendorComplianceRate(vendorId);
    res.json(compliance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

