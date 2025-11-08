import { api } from './api';

export interface CreateOrderData {
  cylinderType: '6kg' | '12kg' | '15kg' | '20kg';
  orderType: 'new' | 'exchange';
  quantity: number;
  deliveryAddressId: string;
  paymentMethod: 'mobile_money_mtn' | 'mobile_money_orange' | 'cash';
}

export interface Order {
  id: string;
  customerId: string;
  vendorId?: string;
  cylinderType: string;
  orderType: string;
  quantity: number;
  status: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
}

export const orderService = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  getMyOrders: async (limit = 50, offset = 0): Promise<Order[]> => {
    const response = await api.get('/orders', {
      params: { limit, offset },
    });
    return response.data;
  },
};

