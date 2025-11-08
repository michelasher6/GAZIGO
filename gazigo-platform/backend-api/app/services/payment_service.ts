import { firestoreService } from './firestore_service'
import axios from 'axios'
import appConfig from '#config/firebase'

export interface PaymentRequest {
  orderId: string
  amount: number
  method: 'mobile_money_mtn' | 'mobile_money_orange' | 'cash'
  phoneNumber: string
}

export class PaymentService {
  async processMobileMoneyMTN(request: PaymentRequest) {
    try {
      // TODO: Integrate with actual MTN Mobile Money API
      const response = await axios.post(
        `${process.env.MTN_MOBILE_MONEY_API_URL}/payment`,
        {
          amount: request.amount,
          phoneNumber: request.phoneNumber,
          reference: request.orderId,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.MTN_MOBILE_MONEY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      // Store payment record in Firestore
      const payment = await firestoreService.create('payments', {
        orderId: request.orderId,
        amount: request.amount,
        method: request.method,
        status: 'processing',
        transactionId: response.data.transactionId,
        receiptUrl: null,
      })

      return payment
    } catch (error) {
      console.error('MTN Mobile Money payment error:', error)
      throw new Error('Payment processing failed')
    }
  }

  async processMobileMoneyOrange(request: PaymentRequest) {
    try {
      // TODO: Integrate with actual Orange Money API
      const response = await axios.post(
        `${process.env.ORANGE_MONEY_API_URL}/payment`,
        {
          amount: request.amount,
          phoneNumber: request.phoneNumber,
          reference: request.orderId,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.ORANGE_MONEY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const payment = await firestoreService.create('payments', {
        orderId: request.orderId,
        amount: request.amount,
        method: request.method,
        status: 'processing',
        transactionId: response.data.transactionId,
        receiptUrl: null,
      })

      return payment
    } catch (error) {
      console.error('Orange Money payment error:', error)
      throw new Error('Payment processing failed')
    }
  }

  async processCashPayment(request: PaymentRequest) {
    // Cash payments are marked as pending until confirmed on delivery
    const payment = await firestoreService.create('payments', {
      orderId: request.orderId,
      amount: request.amount,
      method: request.method,
      status: 'pending',
      transactionId: null,
      receiptUrl: null,
    })

    return payment
  }

  async processPayment(request: PaymentRequest) {
    switch (request.method) {
      case 'mobile_money_mtn':
        return await this.processMobileMoneyMTN(request)
      case 'mobile_money_orange':
        return await this.processMobileMoneyOrange(request)
      case 'cash':
        return await this.processCashPayment(request)
      default:
        throw new Error('Invalid payment method')
    }
  }

  async updatePaymentStatus(
    paymentId: string,
    status: 'completed' | 'failed' | 'refunded'
  ) {
    const payment = await firestoreService.update('payments', paymentId, { status })

    // Update order payment status
    if (status === 'completed') {
      const order = await firestoreService.findById('orders', payment.orderId)
      if (order) {
        await firestoreService.update('orders', payment.orderId, {
          paymentStatus: 'completed',
        })
      }
    }

    return payment
  }
}

export const paymentService = new PaymentService()

