import type { HttpContext } from '@adonisjs/core/http'
import { trackingService } from '#services/tracking_service'

export default class TrackingController {
  async updateLocation({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { lat, lng } = request.body()

      const delivery = await trackingService.updateDeliveryLocation(params.id, lat, lng)
      
      return response.json(delivery)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }

  async updateStatus({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { status } = request.body()

      const delivery = await trackingService.updateDeliveryStatus(params.id, status)
      
      return response.json(delivery)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const tracking = await trackingService.getDeliveryTracking(params.id)
      
      if (!tracking) {
        return response.status(404).json({ error: 'Delivery not found' })
      }

      return response.json(tracking)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

