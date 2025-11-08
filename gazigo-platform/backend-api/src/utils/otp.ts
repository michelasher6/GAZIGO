import { redisClient } from '../config/redis';
import { config } from '../config';

export const generateOTP = (): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < config.otp.length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const storeOTP = async (
  phoneNumber: string,
  otp: string
): Promise<void> => {
  const key = `otp:${phoneNumber}`;
  await redisClient.setEx(key, config.otp.expiresIn, otp);
};

export const verifyOTP = async (
  phoneNumber: string,
  otp: string
): Promise<boolean> => {
  const key = `otp:${phoneNumber}`;
  const storedOTP = await redisClient.get(key);
  
  if (!storedOTP) {
    return false;
  }

  if (storedOTP === otp) {
    await redisClient.del(key);
    return true;
  }

  return false;
};

