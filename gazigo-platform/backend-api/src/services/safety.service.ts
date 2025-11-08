import { query } from '../config/database';

export interface SafetyRecord {
  orderId?: string;
  vendorId?: string;
  inspectionType: string;
  inspectionDate: Date;
  inspectorName: string;
  notes: string;
  isCompliant: boolean;
}

export class SafetyService {
  async createSafetyRecord(data: SafetyRecord) {
    const result = await query(
      `INSERT INTO safety_records (order_id, vendor_id, inspection_type, inspection_date, inspector_name, notes, is_compliant)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.orderId || null,
        data.vendorId || null,
        data.inspectionType,
        data.inspectionDate,
        data.inspectorName,
        data.notes,
        data.isCompliant,
      ]
    );

    return result.rows[0];
  }

  async getSafetyRecords(filters?: {
    orderId?: string;
    vendorId?: string;
    isCompliant?: boolean;
  }) {
    let queryText = 'SELECT * FROM safety_records WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.orderId) {
      queryText += ` AND order_id = $${paramCount}`;
      params.push(filters.orderId);
      paramCount++;
    }

    if (filters?.vendorId) {
      queryText += ` AND vendor_id = $${paramCount}`;
      params.push(filters.vendorId);
      paramCount++;
    }

    if (filters?.isCompliant !== undefined) {
      queryText += ` AND is_compliant = $${paramCount}`;
      params.push(filters.isCompliant);
      paramCount++;
    }

    queryText += ' ORDER BY inspection_date DESC';

    const result = await query(queryText, params);
    return result.rows;
  }

  async getVendorComplianceRate(vendorId: string) {
    const result = await query(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN is_compliant THEN 1 ELSE 0 END) as compliant
       FROM safety_records
       WHERE vendor_id = $1`,
      [vendorId]
    );

    const { total, compliant } = result.rows[0];
    const rate = total > 0 ? (compliant / total) * 100 : 0;

    return {
      total: parseInt(total),
      compliant: parseInt(compliant),
      rate: parseFloat(rate.toFixed(2)),
    };
  }
}

export const safetyService = new SafetyService();

