import { query } from '../config/database';
import { io } from '../index';

export class TrackingService {
  async updateDeliveryLocation(
    deliveryId: string,
    lat: number,
    lng: number
  ) {
    const result = await query(
      `UPDATE deliveries 
       SET current_lat = $1, current_lng = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [lat, lng, deliveryId]
    );

    const delivery = result.rows[0];

    // Get order details
    const orderResult = await query(
      `SELECT o.*, d.id as delivery_id
       FROM orders o
       JOIN deliveries d ON o.id = d.order_id
       WHERE d.id = $1`,
      [deliveryId]
    );

    if (orderResult.rows.length > 0) {
      const order = orderResult.rows[0];
      
      // Emit real-time update via Socket.io
      io.to(`order:${order.id}`).emit('delivery-update', {
        deliveryId: delivery.id,
        orderId: order.id,
        location: { lat, lng },
        status: delivery.status,
        timestamp: new Date().toISOString(),
      });
    }

    return delivery;
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: string
  ) {
    const result = await query(
      `UPDATE deliveries 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, deliveryId]
    );

    const delivery = result.rows[0];

    // Update order status
    await query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = (SELECT order_id FROM deliveries WHERE id = $2)`,
      [status, deliveryId]
    );

    // Get order details for Socket.io emission
    const orderResult = await query(
      `SELECT o.*, d.id as delivery_id
       FROM orders o
       JOIN deliveries d ON o.id = d.order_id
       WHERE d.id = $1`,
      [deliveryId]
    );

    if (orderResult.rows.length > 0) {
      const order = orderResult.rows[0];
      
      io.to(`order:${order.id}`).emit('order-status-update', {
        orderId: order.id,
        status: status,
        timestamp: new Date().toISOString(),
      });
    }

    return delivery;
  }

  async getDeliveryTracking(deliveryId: string) {
    const result = await query(
      `SELECT d.*, o.tracking_number, o.status as order_status
       FROM deliveries d
       JOIN orders o ON d.order_id = o.id
       WHERE d.id = $1`,
      [deliveryId]
    );

    return result.rows[0];
  }
}

export const trackingService = new TrackingService();

