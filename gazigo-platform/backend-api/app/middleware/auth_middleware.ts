import type { HttpContext } from '@adonisjs/core/http'
import { authService } from '#services/auth_service'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const authHeader = ctx.request.header('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.status(401).json({ error: 'No token provided' })
    }

    try {
      const token = authHeader.substring(7)
      const user = await authService.verifyToken(token)
      
      // Attach user to context - AdonisJS pattern
      ctx.request.updateBody({ ...ctx.request.body(), _user: user })
      ctx.auth = {
        user,
        authenticate: async () => user,
      } as any
      
      await next()
    } catch (error) {
      return ctx.response.status(401).json({ error: 'Invalid or expired token' })
    }
  }
}

