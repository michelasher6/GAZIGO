import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  connection: 'local',
  connections: {
    local: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    },
  },
})

