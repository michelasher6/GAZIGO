import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.gazigo.com/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh or logout
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
        }
        return Promise.reject(error);
      }
    );
  }

  get = async (url: string, config?: any) => {
    return this.client.get(url, config);
  };

  post = async (url: string, data?: any, config?: any) => {
    return this.client.post(url, data, config);
  };

  put = async (url: string, data?: any, config?: any) => {
    return this.client.put(url, data, config);
  };

  patch = async (url: string, data?: any, config?: any) => {
    return this.client.patch(url, data, config);
  };

  delete = async (url: string, config?: any) => {
    return this.client.delete(url, config);
  };
}

export const api = new ApiService();

