import { query } from '../config/database';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp';
import { generateTokens } from '../utils/jwt';
import bcrypt from 'bcryptjs';

export interface UserData {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isVerified: boolean;
}

export class AuthService {
  async sendOTP(phoneNumber: string): Promise<string> {
    const otp = generateOTP();
    await storeOTP(phoneNumber, otp);
    
    // TODO: Integrate with SMS gateway
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    
    return otp;
  }

  async verifyOTPCode(phoneNumber: string, otp: string): Promise<boolean> {
    return await verifyOTP(phoneNumber, otp);
  }

  async register(
    phoneNumber: string,
    otp: string,
    userData?: { email?: string; firstName?: string; lastName?: string }
  ): Promise<{ user: UserData; tokens: { accessToken: string; refreshToken: string } }> {
    const isValid = await verifyOTP(phoneNumber, otp);
    if (!isValid) {
      throw new Error('Invalid OTP');
    }

    const result = await query(
      `INSERT INTO users (phone_number, email, first_name, last_name, role, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, phone_number, email, first_name, last_name, role, is_verified`,
      [
        phoneNumber,
        userData?.email || null,
        userData?.firstName || null,
        userData?.lastName || null,
        'customer',
        true,
      ]
    );

    const user = result.rows[0] as UserData;
    const tokens = generateTokens({
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    return { user, tokens };
  }

  async login(phoneNumber: string): Promise<{ otp: string }> {
    const result = await query(
      'SELECT id FROM users WHERE phone_number = $1',
      [phoneNumber]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const otp = await this.sendOTP(phoneNumber);
    return { otp };
  }

  async authenticate(phoneNumber: string, otp: string): Promise<{
    user: UserData;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const isValid = await verifyOTP(phoneNumber, otp);
    if (!isValid) {
      throw new Error('Invalid OTP');
    }

    const result = await query(
      'SELECT id, phone_number, email, first_name, last_name, role, is_verified FROM users WHERE phone_number = $1',
      [phoneNumber]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0] as UserData;
    const tokens = generateTokens({
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    return { user, tokens };
  }
}

export const authService = new AuthService();

