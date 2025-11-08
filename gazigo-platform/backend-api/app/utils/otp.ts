import Redis from 'ioredis'
import otpConfig from '#config/otp'

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export const generateOTP = (): string => {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < otpConfig.length; i++) {
    otp += digits[Math.floor(Math.random() * 10)]
  }
  return otp
}

export const storeOTP = async (phoneNumber: string, otp: string): Promise<void> => {
  const key = `otp:${phoneNumber}`
  await redis.setex(key, otpConfig.expiresIn, otp)
}

export const verifyOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
  const key = `otp:${phoneNumber}`
  const storedOTP = await redis.get(key)
  
  if (!storedOTP) {
    return false
  }

  if (storedOTP === otp) {
    await redis.del(key)
    return true
  }

  return false
}

