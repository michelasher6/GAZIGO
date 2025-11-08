import type { HttpContext } from '@adonisjs/core/http'
import { orderService } from '#services/order_service'
import { z } from 'zod'

const createOrderSchema = z.object({
  cylinderType: z.enum(['6kg', '12kg', '15kg', '20kg']),
  orderType: z.enum(['new', 'exchange']),
  quantity: z.number().int().positive().default(1),
  deliveryAddressId: z.string(),
  paymentMethod: z.enum(['mobile_money_mtn', 'mobile_money_orange', 'cash']),
})

export default class OrderController {
  async create({ request, response, auth }: HttpContext) {
    try {
      const user = (auth as any).user || await (auth as any).authenticate()
      const data = createOrderSchema.parse(request.body())
      
      const order = await orderService.createOrder({
        customerId: user.id,
        ...data,
      })

      return response.status(201).json(order)
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: 'Validation error', details: error.errors })
      }
      return response.status(400).json({ error: error.message })
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      const user = (auth as any).user || await (auth as any).authenticate()
      const order = await orderService.getOrderById(params.id, user.id)

      if (!order) {
        return response.status(404).json({ error: 'Order not found' })
      }

      return response.json(order)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }

  async index({ request, response, auth }: HttpContext) {
    try {
      const user = (auth as any).user || await (auth as any).authenticate()
      const limit = parseInt(request.qs().limit || '50')
      const offset = parseInt(request.qs().offset || '0')

      const orders = await orderService.getOrdersByCustomer(user.id, limit, offset)

      return response.json(orders)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }

  async updateStatus({ params, request, response, auth }: HttpContext) {
    try {
      const user = (auth as any).user || await (auth as any).authenticate()
      const { status, vendorId } = request.body()

      const order = await orderService.updateOrderStatus(
        params.id,
        status,
        vendorId || user.id
      )

      return response.json(order)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

