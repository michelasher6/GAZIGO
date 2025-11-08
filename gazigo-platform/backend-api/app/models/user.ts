import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type UserRole = 'customer' | 'vendor' | 'driver' | 'admin'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare phoneNumber: string

  @column()
  declare email: string | null

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare role: UserRole

  @column()
  declare isVerified: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Convert to Firestore document
   */
  toFirestore() {
    return {
      phoneNumber: this.phoneNumber,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      isVerified: this.isVerified,
      createdAt: this.createdAt.toISO(),
      updatedAt: this.updatedAt.toISO(),
    }
  }

  /**
   * Create from Firestore document
   */
  static fromFirestore(data: any, id: string) {
    const user = new User()
    user.id = id
    user.phoneNumber = data.phoneNumber
    user.email = data.email || null
    user.firstName = data.firstName || null
    user.lastName = data.lastName || null
    user.role = data.role
    user.isVerified = data.isVerified || false
    user.createdAt = DateTime.fromISO(data.createdAt)
    user.updatedAt = DateTime.fromISO(data.updatedAt)
    return user
  }
}

