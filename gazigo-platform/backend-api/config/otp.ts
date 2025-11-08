import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  expiresIn: parseInt(process.env.OTP_EXPIRES_IN || '300', 10),
  length: parseInt(process.env.OTP_LENGTH || '6', 10),
})

