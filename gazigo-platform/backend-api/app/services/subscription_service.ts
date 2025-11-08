import { firestoreService } from './firestore_service'
import { orderService } from './order_service'

export interface CreateSubscriptionData {
  customerId: string
  cylinderType: '6kg' | '12kg' | '15kg' | '20kg'
  frequency: 'weekly' | 'biweekly' | 'monthly'
  deliveryAddressId: string
  paymentMethod: 'mobile_money_mtn' | 'mobile_money_orange' | 'cash'
}

export class SubscriptionService {
  async createSubscription(data: CreateSubscriptionData) {
    // Calculate next delivery date
    const nextDelivery = this.calculateNextDelivery(data.frequency)

    const subscription = await firestoreService.create('subscriptions', {
      customerId: data.customerId,
      cylinderType: data.cylinderType,
      frequency: data.frequency,
      nextDelivery: nextDelivery.toISOString(),
      isActive: true,
      deliveryAddressId: data.deliveryAddressId,
      paymentMethod: data.paymentMethod,
    })

    return subscription
  }

  async getCustomerSubscriptions(customerId: string) {
    const subscriptions = await firestoreService.query(
      'subscriptions',
      [
        { field: 'customerId', operator: '==', value: customerId },
        { field: 'isActive', operator: '==', value: true },
      ],
      { field: 'nextDelivery', direction: 'asc' }
    )

    return subscriptions
  }

  async processScheduledDeliveries() {
    // Get subscriptions due for delivery
    const now = new Date()
    const subscriptions = await firestoreService.query(
      'subscriptions',
      [
        { field: 'isActive', operator: '==', value: true },
      ],
      { field: 'nextDelivery', direction: 'asc' }
    )

    const dueSubscriptions = subscriptions.filter((sub) => {
      const nextDelivery = new Date(sub.nextDelivery)
      return nextDelivery <= now
    })

    for (const subscription of dueSubscriptions) {
      try {
        // Create order for this subscription
        await orderService.createOrder({
          customerId: subscription.customerId,
          cylinderType: subscription.cylinderType,
          orderType: 'new',
          quantity: 1,
          deliveryAddressId: subscription.deliveryAddressId,
          paymentMethod: subscription.paymentMethod,
        })

        // Update next delivery date
        const nextDelivery = this.calculateNextDelivery(
          subscription.frequency,
          new Date(subscription.nextDelivery)
        )
        await firestoreService.update('subscriptions', subscription.id, {
          nextDelivery: nextDelivery.toISOString(),
        })
      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error)
      }
    }

    return dueSubscriptions.length
  }

  async cancelSubscription(subscriptionId: string, customerId: string) {
    const subscription = await firestoreService.findById('subscriptions', subscriptionId)

    if (!subscription || subscription.customerId !== customerId) {
      throw new Error('Subscription not found')
    }

    const updated = await firestoreService.update('subscriptions', subscriptionId, {
      isActive: false,
    })

    return updated
  }

  private calculateNextDelivery(
    frequency: string,
    currentDate?: Date
  ): Date {
    const baseDate = currentDate || new Date()
    const nextDate = new Date(baseDate)

    switch (frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14)
        break
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      default:
        nextDate.setDate(nextDate.getDate() + 30)
    }

    return nextDate
  }
}

export const subscriptionService = new SubscriptionService()

