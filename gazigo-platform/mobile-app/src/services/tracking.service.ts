import { io, Socket } from 'socket.io-client';
import { api } from './api';

const SOCKET_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://api.gazigo.com';

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinOrderRoom = (orderId: string) => {
  if (socket) {
    socket.emit('join-order-room', orderId);
  }
};

export const leaveOrderRoom = (orderId: string) => {
  if (socket) {
    socket.leave(`order:${orderId}`);
  }
};

export const onDeliveryUpdate = (
  callback: (data: {
    deliveryId: string;
    orderId: string;
    location: { lat: number; lng: number };
    status: string;
    timestamp: string;
  }) => void
) => {
  if (socket) {
    socket.on('delivery-update', callback);
  }
};

export const onOrderStatusUpdate = (
  callback: (data: { orderId: string; status: string; timestamp: string }) => void
) => {
  if (socket) {
    socket.on('order-status-update', callback);
  }
};

export const trackingService = {
  getTracking: async (deliveryId: string) => {
    const response = await api.get(`/tracking/${deliveryId}`);
    return response.data;
  },
};

