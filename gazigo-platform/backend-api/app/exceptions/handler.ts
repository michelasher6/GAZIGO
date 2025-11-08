import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class HttpExceptionHandler {
  async handle(error: Exception, ctx: HttpContext) {
    return ctx.response.status(error.status || 500).json({
      error: error.message || 'Internal server error',
    })
  }

  async report(error: Exception, ctx: HttpContext) {
    console.error('Error:', error)
  }
}

