import type { HttpContext } from '@adonisjs/core/http'
import { paymentService } from '#services/payment_service'
import { z } from 'zod'

const processPaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  method: z.enum(['mobile_money_mtn', 'mobile_money_orange', 'cash']),
  phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/),
})

export default class PaymentController {
  async process({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const data = processPaymentSchema.parse(request.body())
      
      const payment = await paymentService.processPayment(data)
      
      return response.status(201).json(payment)
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: 'Validation error', details: error.errors })
      }
      return response.status(400).json({ error: error.message })
    }
  }

  async updateStatus({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { status } = request.body()

      const payment = await paymentService.updatePaymentStatus(params.id, status)
      
      return response.json(payment)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

