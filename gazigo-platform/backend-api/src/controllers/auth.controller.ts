import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { z } from 'zod';

const sendOTPSchema = z.object({
  body: z.object({
    phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/),
  }),
});

const verifyOTPSchema = z.object({
  body: z.object({
    phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/),
    otp: z.string().length(6),
  }),
});

const registerSchema = z.object({
  body: z.object({
    phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/),
    otp: z.string().length(6),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const otp = await authService.sendOTP(phoneNumber);
    res.json({ message: 'OTP sent successfully', otp: process.env.NODE_ENV === 'development' ? otp : undefined });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;
    const isValid = await authService.verifyOTP(phoneNumber, otp);
    res.json({ valid: isValid });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp, email, firstName, lastName } = req.body;
    const result = await authService.register(phoneNumber, otp, {
      email,
      firstName,
      lastName,
    });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const result = await authService.login(phoneNumber);
    res.json({ message: 'OTP sent successfully', otp: process.env.NODE_ENV === 'development' ? result.otp : undefined });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;
    const result = await authService.authenticate(phoneNumber, otp);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

