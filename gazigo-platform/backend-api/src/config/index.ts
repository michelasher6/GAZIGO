import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  otp: {
    expiresIn: parseInt(process.env.OTP_EXPIRES_IN || '300', 10),
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
  },
  mobileMoney: {
    mtn: {
      apiKey: process.env.MTN_MOBILE_MONEY_API_KEY || '',
      apiUrl: process.env.MTN_MOBILE_MONEY_API_URL || '',
    },
    orange: {
      apiKey: process.env.ORANGE_MONEY_API_KEY || '',
      apiUrl: process.env.ORANGE_MONEY_API_URL || '',
    },
  },
  maps: {
    google: process.env.GOOGLE_MAPS_API_KEY || '',
    mapbox: process.env.MAPBOX_API_KEY || '',
  },
  sms: {
    apiKey: process.env.SMS_API_KEY || '',
    apiUrl: process.env.SMS_API_URL || '',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || 'gazigo-uploads',
  },
  socketIo: {
    corsOrigin: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3001',
  },
} as const;

