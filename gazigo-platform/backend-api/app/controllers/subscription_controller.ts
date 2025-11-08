import type { HttpContext } from '@adonisjs/core/http'
import { subscriptionService } from '#services/subscription_service'
import { z } from 'zod'

const createSubscriptionSchema = z.object({
  cylinderType: z.enum(['6kg', '12kg', '15kg', '20kg']),
  frequency: z.enum(['weekly', 'biweekly', 'monthly']),
  deliveryAddressId: z.string(),
  paymentMethod: z.enum(['mobile_money_mtn', 'mobile_money_orange', 'cash']),
})

export default class SubscriptionController {
  async create({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const data = createSubscriptionSchema.parse(request.body())
      
      const subscription = await subscriptionService.createSubscription({
        customerId: user.id,
        ...data,
      })

      return response.status(201).json(subscription)
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: 'Validation error', details: error.errors })
      }
      return response.status(400).json({ error: error.message })
    }
  }

  async index({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const subscriptions = await subscriptionService.getCustomerSubscriptions(user.id)

      return response.json(subscriptions)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const subscription = await subscriptionService.cancelSubscription(params.id, user.id)

      return response.json(subscription)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

