import { firestoreService } from './firestore_service'
import { getRealtimeDatabase } from './firebase_service'

export interface CreateOrderData {
  customerId: string
  cylinderType: '6kg' | '12kg' | '15kg' | '20kg'
  orderType: 'new' | 'exchange'
  quantity: number
  deliveryAddressId: string
  paymentMethod: 'mobile_money_mtn' | 'mobile_money_orange' | 'cash'
}

export class OrderService {
  private db = getRealtimeDatabase()

  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderData) {
    const trackingNumber = `GAZ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Calculate pricing
    const basePrice = this.getCylinderPrice(data.cylinderType)
    const deliveryFee = 1000
    const totalAmount = basePrice * data.quantity + deliveryFee

    // Create order in Firestore
    const order = await firestoreService.create('orders', {
      customerId: data.customerId,
      vendorId: null,
      cylinderType: data.cylinderType,
      orderType: data.orderType,
      quantity: data.quantity,
      status: 'pending',
      deliveryAddressId: data.deliveryAddressId,
      totalAmount,
      deliveryFee,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'pending',
      trackingNumber,
      estimatedDelivery: null,
      deliveredAt: null,
    })

    // Create delivery record in Firestore
    await firestoreService.create('deliveries', {
      orderId: order.id,
      driverId: null,
      status: 'pending',
      currentLat: null,
      currentLng: null,
      startedAt: null,
      completedAt: null,
    })

    // Create real-time tracking entry
    await this.db.ref(`orders/${order.id}`).set({
      status: 'pending',
      trackingNumber,
      updatedAt: new Date().toISOString(),
    })

    return order
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string, userId?: string) {
    const order = await firestoreService.findById('orders', orderId)
    
    if (!order) {
      return null
    }

    // Check authorization
    if (userId && order.customerId !== userId && order.vendorId !== userId) {
      return null
    }

    // Get delivery address
    if (order.deliveryAddressId) {
      const address = await firestoreService.findById('addresses', order.deliveryAddressId)
      order.deliveryAddress = address
    }

    // Get customer info
    const customer = await firestoreService.findById('users', order.customerId)
    order.customer = customer

    return order
  }

  /**
   * Get orders by customer
   */
  async getOrdersByCustomer(customerId: string, limit = 50, offset = 0) {
    const orders = await firestoreService.query(
      'orders',
      [{ field: 'customerId', operator: '==', value: customerId }],
      { field: 'createdAt', direction: 'desc' },
      limit
    )

    // Get addresses for orders
    for (const order of orders) {
      if (order.deliveryAddressId) {
        const address = await firestoreService.findById('addresses', order.deliveryAddressId)
        order.deliveryAddress = address
      }
    }

    return orders
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string, vendorId?: string) {
    const updateData: any = { status }
    
    if (vendorId) {
      updateData.vendorId = vendorId
    }

    const order = await firestoreService.update('orders', orderId, updateData)

    // Update real-time database
    await this.db.ref(`orders/${orderId}`).update({
      status,
      updatedAt: new Date().toISOString(),
    })

    return order
  }

  /**
   * Get cylinder price
   */
  private getCylinderPrice(cylinderType: string): number {
    const prices: Record<string, number> = {
      '6kg': 5000,
      '12kg': 8000,
      '15kg': 10000,
      '20kg': 12000,
    }
    return prices[cylinderType] || 0
  }
}

export const orderService = new OrderService()

