import type { HttpContext } from '@adonisjs/core/http'
import { authService } from '#services/auth_service'
import { z } from 'zod'

const sendOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/),
})

const verifyOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/),
  otp: z.string().length(6),
})

const registerSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/),
  otp: z.string().length(6),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export default class AuthController {
  async sendOTP({ request, response }: HttpContext) {
    try {
      const { phoneNumber } = sendOTPSchema.parse(request.body())
      const otp = await authService.sendOTP(phoneNumber)
      
      return response.json({
        message: 'OTP sent successfully',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: 'Validation error', details: error.errors })
      }
      return response.status(500).json({ error: error.message })
    }
  }

  async verifyOTP({ request, response }: HttpContext) {
    try {
      const { phoneNumber, otp } = verifyOTPSchema.parse(request.body())
      const isValid = await authService.verifyOTPCode(phoneNumber, otp)
      
      return response.json({ valid: isValid })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: 'Validation error', details: error.errors })
      }
      return response.status(500).json({ error: error.message })
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      const data = registerSchema.parse(request.body())
      const result = await authService.register(
        data.phoneNumber,
        data.otp,
        {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        }
      )
      
      return response.status(201).json(result)
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: 'Validation error', details: error.errors })
      }
      return response.status(400).json({ error: error.message })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const { phoneNumber } = sendOTPSchema.parse(request.body())
      const result = await authService.login(phoneNumber)
      
      return response.json({
        message: 'OTP sent successfully',
        otp: process.env.NODE_ENV === 'development' ? result.otp : undefined,
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: 'Validation error', details: error.errors })
      }
      return response.status(400).json({ error: error.message })
    }
  }

  async authenticate({ request, response }: HttpContext) {
    try {
      const { phoneNumber, otp } = verifyOTPSchema.parse(request.body())
      const result = await authService.authenticate(phoneNumber, otp)
      
      return response.json(result)
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: 'Validation error', details: error.errors })
      }
      return response.status(400).json({ error: error.message })
    }
  }
}

