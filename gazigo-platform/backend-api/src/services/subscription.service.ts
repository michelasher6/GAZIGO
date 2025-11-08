import { query } from '../config/database';
import { orderService } from './order.service';

export interface CreateSubscriptionData {
  customerId: string;
  cylinderType: '6kg' | '12kg' | '15kg' | '20kg';
  frequency: 'weekly' | 'biweekly' | 'monthly';
  deliveryAddressId: string;
  paymentMethod: 'mobile_money_mtn' | 'mobile_money_orange' | 'cash';
}

export class SubscriptionService {
  async createSubscription(data: CreateSubscriptionData) {
    // Calculate next delivery date
    const nextDelivery = this.calculateNextDelivery(data.frequency);

    const result = await query(
      `INSERT INTO subscriptions (customer_id, cylinder_type, frequency, next_delivery, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.customerId,
        data.cylinderType,
        data.frequency,
        nextDelivery,
        true,
      ]
    );

    return result.rows[0];
  }

  async getCustomerSubscriptions(customerId: string) {
    const result = await query(
      `SELECT * FROM subscriptions 
       WHERE customer_id = $1 AND is_active = true
       ORDER BY next_delivery ASC`,
      [customerId]
    );

    return result.rows;
  }

  async processScheduledDeliveries() {
    // Get subscriptions due for delivery
    const result = await query(
      `SELECT * FROM subscriptions 
       WHERE is_active = true 
       AND next_delivery <= CURRENT_TIMESTAMP
       ORDER BY next_delivery ASC`
    );

    const subscriptions = result.rows;

    for (const subscription of subscriptions) {
      try {
        // Create order for this subscription
        await orderService.createOrder({
          customerId: subscription.customer_id,
          cylinderType: subscription.cylinder_type,
          orderType: 'new',
          quantity: 1,
          deliveryAddressId: subscription.delivery_address_id || '',
          paymentMethod: subscription.payment_method || 'cash',
        });

        // Update next delivery date
        const nextDelivery = this.calculateNextDelivery(
          subscription.frequency,
          subscription.next_delivery
        );
        await query(
          `UPDATE subscriptions 
           SET next_delivery = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [nextDelivery, subscription.id]
        );
      } catch (error) {
        console.error(
          `Error processing subscription ${subscription.id}:`,
          error
        );
      }
    }

    return subscriptions.length;
  }

  async cancelSubscription(subscriptionId: string, customerId: string) {
    const result = await query(
      `UPDATE subscriptions 
       SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND customer_id = $2
       RETURNING *`,
      [subscriptionId, customerId]
    );

    return result.rows[0];
  }

  private calculateNextDelivery(
    frequency: string,
    currentDate?: Date | string
  ): Date {
    const baseDate = currentDate
      ? new Date(currentDate)
      : new Date();
    const nextDate = new Date(baseDate);

    switch (frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      default:
        nextDate.setDate(nextDate.getDate() + 30);
    }

    return nextDate;
  }
}

export const subscriptionService = new SubscriptionService();

