import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  appKey: process.env.APP_KEY || '',
  http: {
    allowMethodSpoofing: false,
    trustProxy: false,
    forceContentNegotiationTo: 'application/json',
  },
})

