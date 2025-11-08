/**
 * GAZIGO Brand Constants
 */
export const BRAND = {
  name: 'GAZIGO',
  slogan: {
    en: 'Your gas, delivered safely.',
    fr: 'Votre gaz, livré en toute sécurité.',
  },
  tagline: {
    en: 'Safe, reliable, accessible gas delivery',
    fr: 'Livraison de gaz sûre, fiable et accessible',
  },
} as const;

export const CYLINDER_TYPES = [
  { id: '6kg', label: '6kg', weight: 6 },
  { id: '12kg', label: '12kg', weight: 12 },
  { id: '15kg', label: '15kg', weight: 15 },
  { id: '20kg', label: '20kg', weight: 20 },
] as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  DISPATCHED: 'dispatched',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const USER_ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  DRIVER: 'driver',
  ADMIN: 'admin',
} as const;

export const PAYMENT_METHODS = {
  MOBILE_MONEY_MTN: 'mobile_money_mtn',
  MOBILE_MONEY_ORANGE: 'mobile_money_orange',
  CASH: 'cash',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

