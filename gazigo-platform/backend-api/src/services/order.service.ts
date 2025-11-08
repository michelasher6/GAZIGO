import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface CreateOrderData {
  customerId: string;
  cylinderType: '6kg' | '12kg' | '15kg' | '20kg';
  orderType: 'new' | 'exchange';
  quantity: number;
  deliveryAddressId: string;
  paymentMethod: 'mobile_money_mtn' | 'mobile_money_orange' | 'cash';
}

export class OrderService {
  async createOrder(data: CreateOrderData) {
    const trackingNumber = `GAZ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Calculate pricing (simplified - should come from pricing service)
    const basePrice = this.getCylinderPrice(data.cylinderType);
    const deliveryFee = 1000; // Fixed for now
    const totalAmount = basePrice * data.quantity + deliveryFee;

    const result = await query(
      `INSERT INTO orders (
        customer_id, cylinder_type, order_type, quantity, 
        delivery_address_id, total_amount, delivery_fee, 
        payment_method, tracking_number, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.customerId,
        data.cylinderType,
        data.orderType,
        data.quantity,
        data.deliveryAddressId,
        totalAmount,
        deliveryFee,
        data.paymentMethod,
        trackingNumber,
        'pending',
      ]
    );

    const order = result.rows[0];

    // Create delivery record
    await query(
      `INSERT INTO deliveries (order_id, status) VALUES ($1, $2)`,
      [order.id, 'pending']
    );

    return order;
  }

  async getOrderById(orderId: string, userId?: string) {
    let queryText = `
      SELECT o.*, 
             a.label as address_label, a.street, a.city, a.neighborhood,
             u.first_name, u.last_name, u.phone_number as customer_phone
      FROM orders o
      LEFT JOIN addresses a ON o.delivery_address_id = a.id
      LEFT JOIN users u ON o.customer_id = u.id
      WHERE o.id = $1
    `;
    const params: any[] = [orderId];

    if (userId) {
      queryText += ' AND (o.customer_id = $2 OR o.vendor_id = $2)';
      params.push(userId);
    }

    const result = await query(queryText, params);
    return result.rows[0];
  }

  async getOrdersByCustomer(customerId: string, limit = 50, offset = 0) {
    const result = await query(
      `SELECT o.*, 
              a.label as address_label, a.street, a.city
       FROM orders o
       LEFT JOIN addresses a ON o.delivery_address_id = a.id
       WHERE o.customer_id = $1
       ORDER BY o.created_at DESC
       LIMIT $2 OFFSET $3`,
      [customerId, limit, offset]
    );
    return result.rows;
  }

  async updateOrderStatus(orderId: string, status: string, vendorId?: string) {
    const result = await query(
      `UPDATE orders 
       SET status = $1, vendor_id = COALESCE($2, vendor_id), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, vendorId, orderId]
    );
    return result.rows[0];
  }

  private getCylinderPrice(cylinderType: string): number {
    const prices: Record<string, number> = {
      '6kg': 5000,
      '12kg': 8000,
      '15kg': 10000,
      '20kg': 12000,
    };
    return prices[cylinderType] || 0;
  }
}

export const orderService = new OrderService();

