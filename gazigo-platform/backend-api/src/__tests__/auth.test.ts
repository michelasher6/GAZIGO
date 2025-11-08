import { authService } from '../services/auth.service';

describe('AuthService', () => {
  describe('sendOTP', () => {
    it('should generate and store OTP', async () => {
      const phoneNumber = '+237612345678';
      const otp = await authService.sendOTP(phoneNumber);
      expect(otp).toBeDefined();
      expect(otp.length).toBe(6);
    });
  });

  describe('register', () => {
    it('should register a new user with valid OTP', async () => {
      const phoneNumber = '+237612345678';
      const otp = await authService.sendOTP(phoneNumber);
      
      const result = await authService.register(phoneNumber, otp, {
        firstName: 'Test',
        lastName: 'User',
      });

      expect(result.user).toBeDefined();
      expect(result.user.phoneNumber).toBe(phoneNumber);
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
    });
  });
});

