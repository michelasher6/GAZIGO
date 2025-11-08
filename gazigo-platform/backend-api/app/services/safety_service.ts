import { firestoreService } from './firestore_service'

export interface SafetyRecord {
  orderId?: string
  vendorId?: string
  inspectionType: string
  inspectionDate: Date
  inspectorName: string
  notes: string
  isCompliant: boolean
}

export class SafetyService {
  async createSafetyRecord(data: SafetyRecord) {
    const record = await firestoreService.create('safety_records', {
      orderId: data.orderId || null,
      vendorId: data.vendorId || null,
      inspectionType: data.inspectionType,
      inspectionDate: data.inspectionDate.toISOString(),
      inspectorName: data.inspectorName,
      notes: data.notes,
      isCompliant: data.isCompliant,
    })

    return record
  }

  async getSafetyRecords(filters?: {
    orderId?: string
    vendorId?: string
    isCompliant?: boolean
  }) {
    const queryFilters: any[] = []

    if (filters?.orderId) {
      queryFilters.push({ field: 'orderId', operator: '==', value: filters.orderId })
    }

    if (filters?.vendorId) {
      queryFilters.push({ field: 'vendorId', operator: '==', value: filters.vendorId })
    }

    if (filters?.isCompliant !== undefined) {
      queryFilters.push({ field: 'isCompliant', operator: '==', value: filters.isCompliant })
    }

    const records = await firestoreService.query(
      'safety_records',
      queryFilters.length > 0 ? queryFilters : undefined,
      { field: 'inspectionDate', direction: 'desc' }
    )

    return records
  }

  async getVendorComplianceRate(vendorId: string) {
    const records = await firestoreService.query('safety_records', [
      { field: 'vendorId', operator: '==', value: vendorId },
    ])

    const total = records.length
    const compliant = records.filter((r) => r.isCompliant).length
    const rate = total > 0 ? (compliant / total) * 100 : 0

    return {
      total,
      compliant,
      rate: parseFloat(rate.toFixed(2)),
    }
  }
}

export const safetyService = new SafetyService()

