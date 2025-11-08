import admin from 'firebase-admin'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import appConfig from '#config/firebase'

/**
 * Initialize Firebase Admin SDK
 */
let firebaseApp: admin.app.App | null = null

export function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp
  }

  try {
    // Try to use service account from environment or file
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    
    if (serviceAccountPath) {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: appConfig.databaseURL,
      })
    } else if (appConfig.privateKey && appConfig.clientEmail) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: appConfig.projectId,
          privateKey: appConfig.privateKey,
          clientEmail: appConfig.clientEmail,
        }),
        databaseURL: appConfig.databaseURL,
      })
    } else {
      throw new Error('Firebase credentials not configured')
    }

    return firebaseApp
  } catch (error) {
    console.error('Firebase initialization error:', error)
    throw error
  }
}

/**
 * Get Firestore instance
 */
export function getFirestore() {
  if (!firebaseApp) {
    initializeFirebase()
  }
  return admin.firestore()
}

/**
 * Get Realtime Database instance
 */
export function getRealtimeDatabase() {
  if (!firebaseApp) {
    initializeFirebase()
  }
  return admin.database()
}

/**
 * Get Firebase Auth instance
 */
export function getAuth() {
  if (!firebaseApp) {
    initializeFirebase()
  }
  return admin.auth()
}

/**
 * Initialize Firebase on app start
 */
initializeFirebase()

