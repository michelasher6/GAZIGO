import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Firebase Configuration
  |--------------------------------------------------------------------------
  */
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  databaseURL: process.env.FIREBASE_DATABASE_URL || '',
  
  /*
  |--------------------------------------------------------------------------
  | Firestore Settings
  |--------------------------------------------------------------------------
  */
  firestore: {
    databaseId: '(default)',
  },

  /*
  |--------------------------------------------------------------------------
  | Realtime Database Settings
  |--------------------------------------------------------------------------
  */
  realtime: {
    databaseURL: process.env.FIREBASE_REALTIME_DB_URL || '',
  },
})

