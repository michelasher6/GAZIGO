import { firestoreService } from './firestore_service'
import { getRealtimeDatabase } from './firebase_service'

export class TrackingService {
  private db = getRealtimeDatabase()

  async updateDeliveryLocation(
    deliveryId: string,
    lat: number,
    lng: number
  ) {
    const delivery = await firestoreService.update('deliveries', deliveryId, {
      currentLat: lat,
      currentLng: lng,
    })

    // Get order details
    const order = await firestoreService.findById('orders', delivery.orderId)

    if (order) {
      // Update real-time database
      await this.db.ref(`orders/${order.id}`).update({
        location: { lat, lng },
        status: delivery.status,
        updatedAt: new Date().toISOString(),
      })
    }

    return delivery
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: string
  ) {
    const delivery = await firestoreService.update('deliveries', deliveryId, {
      status,
    })

    // Update order status
    await firestoreService.update('orders', delivery.orderId, { status })

    // Get order for real-time update
    const order = await firestoreService.findById('orders', delivery.orderId)

    if (order) {
      // Update real-time database
      await this.db.ref(`orders/${order.id}`).update({
        status,
        updatedAt: new Date().toISOString(),
      })
    }

    return delivery
  }

  async getDeliveryTracking(deliveryId: string) {
    const delivery = await firestoreService.findById('deliveries', deliveryId)

    if (!delivery) {
      return null
    }

    // Get order details
    const order = await firestoreService.findById('orders', delivery.orderId)

    return {
      ...delivery,
      order: order ? {
        trackingNumber: order.trackingNumber,
        status: order.status,
      } : null,
    }
  }
}

export const trackingService = new TrackingService()

