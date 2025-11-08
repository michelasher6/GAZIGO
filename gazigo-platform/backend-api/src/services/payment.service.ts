import axios from 'axios';
import { config } from '../config';
import { query } from '../config/database';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: 'mobile_money_mtn' | 'mobile_money_orange' | 'cash';
  phoneNumber: string;
}

export class PaymentService {
  async processMobileMoneyMTN(request: PaymentRequest) {
    try {
      // TODO: Integrate with actual MTN Mobile Money API
      const response = await axios.post(
        `${config.mobileMoney.mtn.apiUrl}/payment`,
        {
          amount: request.amount,
          phoneNumber: request.phoneNumber,
          reference: request.orderId,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.mobileMoney.mtn.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Store payment record
      const paymentResult = await query(
        `INSERT INTO payments (order_id, amount, method, status, transaction_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          request.orderId,
          request.amount,
          request.method,
          'processing',
          response.data.transactionId,
        ]
      );

      return paymentResult.rows[0];
    } catch (error) {
      console.error('MTN Mobile Money payment error:', error);
      throw new Error('Payment processing failed');
    }
  }

  async processMobileMoneyOrange(request: PaymentRequest) {
    try {
      // TODO: Integrate with actual Orange Money API
      const response = await axios.post(
        `${config.mobileMoney.orange.apiUrl}/payment`,
        {
          amount: request.amount,
          phoneNumber: request.phoneNumber,
          reference: request.orderId,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.mobileMoney.orange.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const paymentResult = await query(
        `INSERT INTO payments (order_id, amount, method, status, transaction_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          request.orderId,
          request.amount,
          request.method,
          'processing',
          response.data.transactionId,
        ]
      );

      return paymentResult.rows[0];
    } catch (error) {
      console.error('Orange Money payment error:', error);
      throw new Error('Payment processing failed');
    }
  }

  async processCashPayment(request: PaymentRequest) {
    // Cash payments are marked as pending until confirmed on delivery
    const paymentResult = await query(
      `INSERT INTO payments (order_id, amount, method, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [request.orderId, request.amount, request.method, 'pending']
    );

    return paymentResult.rows[0];
  }

  async processPayment(request: PaymentRequest) {
    switch (request.method) {
      case 'mobile_money_mtn':
        return await this.processMobileMoneyMTN(request);
      case 'mobile_money_orange':
        return await this.processMobileMoneyOrange(request);
      case 'cash':
        return await this.processCashPayment(request);
      default:
        throw new Error('Invalid payment method');
    }
  }

  async updatePaymentStatus(
    paymentId: string,
    status: 'completed' | 'failed' | 'refunded'
  ) {
    const result = await query(
      `UPDATE payments 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, paymentId]
    );

    // Update order payment status
    if (status === 'completed') {
      await query(
        `UPDATE orders 
         SET payment_status = 'completed', updated_at = CURRENT_TIMESTAMP
         WHERE id = (SELECT order_id FROM payments WHERE id = $1)`,
        [paymentId]
      );
    }

    return result.rows[0];
  }
}

export const paymentService = new PaymentService();

