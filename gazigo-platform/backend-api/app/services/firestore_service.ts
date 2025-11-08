import { getFirestore } from './firebase_service'
import type { DocumentData, QuerySnapshot } from 'firebase-admin/firestore'

/**
 * Firestore Service - Wrapper for Firestore operations
 */
export class FirestoreService {
  private db = getFirestore()

  /**
   * Create a document
   */
  async create(collection: string, data: DocumentData, id?: string) {
    const docRef = id ? this.db.collection(collection).doc(id) : this.db.collection(collection).doc()
    
    await docRef.set({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return { id: docRef.id, ...data }
  }

  /**
   * Get a document by ID
   */
  async findById(collection: string, id: string) {
    const doc = await this.db.collection(collection).doc(id).get()
    
    if (!doc.exists) {
      return null
    }

    return { id: doc.id, ...doc.data() }
  }

  /**
   * Update a document
   */
  async update(collection: string, id: string, data: Partial<DocumentData>) {
    await this.db.collection(collection).doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    })

    return this.findById(collection, id)
  }

  /**
   * Delete a document
   */
  async delete(collection: string, id: string) {
    await this.db.collection(collection).doc(id).delete()
    return true
  }

  /**
   * Query documents with filters
   */
  async query(
    collection: string,
    filters?: Array<{ field: string; operator: any; value: any }>,
    orderBy?: { field: string; direction: 'asc' | 'desc' },
    limit?: number
  ) {
    let query: any = this.db.collection(collection)

    if (filters) {
      filters.forEach((filter) => {
        query = query.where(filter.field, filter.operator, filter.value)
      })
    }

    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.direction)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const snapshot = await query.get()
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
  }

  /**
   * Get all documents in a collection
   */
  async findAll(collection: string) {
    const snapshot = await this.db.collection(collection).get()
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
  }

  /**
   * Batch write operations
   */
  async batch(operations: Array<{ type: 'create' | 'update' | 'delete'; collection: string; id?: string; data?: any }>) {
    const batch = this.db.batch()

    operations.forEach((op) => {
      if (op.type === 'create') {
        const docRef = op.id 
          ? this.db.collection(op.collection).doc(op.id)
          : this.db.collection(op.collection).doc()
        batch.set(docRef, {
          ...op.data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      } else if (op.type === 'update' && op.id) {
        const docRef = this.db.collection(op.collection).doc(op.id)
        batch.update(docRef, {
          ...op.data,
          updatedAt: new Date().toISOString(),
        })
      } else if (op.type === 'delete' && op.id) {
        const docRef = this.db.collection(op.collection).doc(op.id)
        batch.delete(docRef)
      }
    })

    await batch.commit()
    return true
  }
}

export const firestoreService = new FirestoreService()

