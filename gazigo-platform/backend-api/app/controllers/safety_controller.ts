import type { HttpContext } from '@adonisjs/core/http'
import { safetyService } from '#services/safety_service'

export default class SafetyController {
  async create({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const data = request.body()

      const record = await safetyService.createSafetyRecord({
        orderId: data.orderId,
        vendorId: data.vendorId,
        inspectionType: data.inspectionType,
        inspectionDate: new Date(data.inspectionDate),
        inspectorName: data.inspectorName,
        notes: data.notes,
        isCompliant: data.isCompliant,
      })

      return response.status(201).json(record)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }

  async index({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const filters = {
        orderId: request.qs().orderId,
        vendorId: request.qs().vendorId,
        isCompliant: request.qs().isCompliant === 'true' ? true : request.qs().isCompliant === 'false' ? false : undefined,
      }

      const records = await safetyService.getSafetyRecords(filters)
      
      return response.json(records)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }

  async vendorCompliance({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const compliance = await safetyService.getVendorComplianceRate(params.vendorId)
      
      return response.json(compliance)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

