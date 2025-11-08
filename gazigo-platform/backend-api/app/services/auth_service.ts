import { getAuth } from './firebase_service'
import { firestoreService } from './firestore_service'
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp'
import type { UserRole } from '../models/user'

export interface UserData {
  id: string
  phoneNumber: string
  email?: string
  firstName?: string
  lastName?: string
  role: UserRole
  isVerified: boolean
}

export class AuthService {
  private auth = getAuth()

  /**
   * Send OTP to phone number
   */
  async sendOTP(phoneNumber: string): Promise<string> {
    const otp = generateOTP()
    await storeOTP(phoneNumber, otp)
    
    // TODO: Integrate with SMS gateway
    console.log(`OTP for ${phoneNumber}: ${otp}`)
    
    return otp
  }

  /**
   * Verify OTP
   */
  async verifyOTPCode(phoneNumber: string, otp: string): Promise<boolean> {
    return await verifyOTP(phoneNumber, otp)
  }

  /**
   * Register new user with Firebase Auth and Firestore
   */
  async register(
    phoneNumber: string,
    otp: string,
    userData?: { email?: string; firstName?: string; lastName?: string }
  ): Promise<{ user: UserData; customToken: string }> {
    const isValid = await verifyOTP(phoneNumber, otp)
    if (!isValid) {
      throw new Error('Invalid OTP')
    }

    // Create user in Firebase Auth
    const firebaseUser = await this.auth.createUser({
      phoneNumber,
      email: userData?.email,
      displayName: userData?.firstName && userData?.lastName 
        ? `${userData.firstName} ${userData.lastName}`
        : undefined,
    })

    // Create custom token for client
    const customToken = await this.auth.createCustomToken(firebaseUser.uid)

    // Store user data in Firestore
    const userDoc = await firestoreService.create('users', {
      phoneNumber,
      email: userData?.email || null,
      firstName: userData?.firstName || null,
      lastName: userData?.lastName || null,
      role: 'customer',
      isVerified: true,
      firebaseUid: firebaseUser.uid,
    }, firebaseUser.uid)

    const user: UserData = {
      id: userDoc.id,
      phoneNumber: userDoc.phoneNumber,
      email: userDoc.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      role: userDoc.role,
      isVerified: userDoc.isVerified,
    }

    return { user, customToken }
  }

  /**
   * Login - Send OTP
   */
  async login(phoneNumber: string): Promise<{ otp: string }> {
    // Check if user exists in Firestore
    const users = await firestoreService.query('users', [
      { field: 'phoneNumber', operator: '==', value: phoneNumber }
    ])

    if (users.length === 0) {
      throw new Error('User not found')
    }

    const otp = await this.sendOTP(phoneNumber)
    return { otp }
  }

  /**
   * Authenticate user with OTP
   */
  async authenticate(phoneNumber: string, otp: string): Promise<{
    user: UserData
    customToken: string
  }> {
    const isValid = await verifyOTP(phoneNumber, otp)
    if (!isValid) {
      throw new Error('Invalid OTP')
    }

    // Get user from Firestore
    const users = await firestoreService.query('users', [
      { field: 'phoneNumber', operator: '==', value: phoneNumber }
    ])

    if (users.length === 0) {
      throw new Error('User not found')
    }

    const userDoc = users[0]

    // Get Firebase user
    const firebaseUser = await this.auth.getUser(userDoc.firebaseUid)

    // Create custom token
    const customToken = await this.auth.createCustomToken(firebaseUser.uid)

    const user: UserData = {
      id: userDoc.id,
      phoneNumber: userDoc.phoneNumber,
      email: userDoc.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      role: userDoc.role,
      isVerified: userDoc.isVerified,
    }

    return { user, customToken }
  }

  /**
   * Verify Firebase ID token
   */
  async verifyToken(idToken: string): Promise<UserData> {
    const decodedToken = await this.auth.verifyIdToken(idToken)
    
    const userDoc = await firestoreService.findById('users', decodedToken.uid)
    
    if (!userDoc) {
      throw new Error('User not found')
    }

    return {
      id: userDoc.id,
      phoneNumber: userDoc.phoneNumber,
      email: userDoc.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      role: userDoc.role,
      isVerified: userDoc.isVerified,
    }
  }
}

export const authService = new AuthService()

