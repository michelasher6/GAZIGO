import { Router } from 'express';
import {
  sendOTP,
  verifyOTP,
  register,
  login,
  authenticate,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

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

router.post('/send-otp', validate(sendOTPSchema), sendOTP);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(sendOTPSchema), login);
router.post('/authenticate', validate(verifyOTPSchema), authenticate);

export default router;

