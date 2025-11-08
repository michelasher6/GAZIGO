import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginResponse {
  message: string;
  otp?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    phoneNumber: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  sendOTP: async (phoneNumber: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/send-otp', { phoneNumber });
    return response.data;
  },

  login: async (phoneNumber: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { phoneNumber });
    return response.data;
  },

  verifyOTP: async (phoneNumber: string, otp: string): Promise<boolean> => {
    const response = await api.post('/auth/verify-otp', { phoneNumber, otp });
    return response.data.valid;
  },

  register: async (
    phoneNumber: string,
    otp: string,
    userData?: { email?: string; firstName?: string; lastName?: string }
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', {
      phoneNumber,
      otp,
      ...userData,
    });
    const { user, tokens } = response.data;
    await AsyncStorage.setItem('accessToken', tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
    return response.data;
  },

  authenticate: async (
    phoneNumber: string,
    otp: string
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/authenticate', {
      phoneNumber,
      otp,
    });
    const { user, tokens } = response.data;
    await AsyncStorage.setItem('accessToken', tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
  },

  getStoredToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('accessToken');
  },
};

