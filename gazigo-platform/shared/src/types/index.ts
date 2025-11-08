/**
 * Shared TypeScript types for GAZIGO platform
 */

export type UserRole = 'customer' | 'vendor' | 'driver' | 'admin';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod =
  | 'mobile_money_mtn'
  | 'mobile_money_orange'
  | 'cash';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export type CylinderType = '6kg' | '12kg' | '15kg' | '20kg';

export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends User {
  role: 'customer';
  addresses: Address[];
  subscriptions?: Subscription[];
}

export interface Vendor extends User {
  role: 'vendor';
  businessName: string;
  location: Location;
  isVerified: boolean;
  rating?: number;
  inventory: InventoryItem[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  neighborhood?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  neighborhood?: string;
}

export interface Order {
  id: string;
  customerId: string;
  vendorId?: string;
  cylinderType: CylinderType;
  orderType: 'new' | 'exchange';
  quantity: number;
  status: OrderStatus;
  deliveryAddress: Address;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId?: string;
  status: OrderStatus;
  currentLocation?: Location;
  route?: Location[];
  startedAt?: string;
  completedAt?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  vendorId: string;
  cylinderType: CylinderType;
  quantity: number;
  price: number;
  lastUpdated: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  cylinderType: CylinderType;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextDelivery: string;
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'payment' | 'delivery' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

