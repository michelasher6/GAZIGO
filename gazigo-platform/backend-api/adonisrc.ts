import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Application name
  |--------------------------------------------------------------------------
  */
  appName: 'GAZIGO API',

  /*
  |--------------------------------------------------------------------------
  | The URL of the application
  |--------------------------------------------------------------------------
  */
  appUrl: process.env.APP_URL || 'http://localhost:3000',

  /*
  |--------------------------------------------------------------------------
  | Directories
  |--------------------------------------------------------------------------
  */
  directories: {
    commands: 'commands',
    middleware: 'middleware',
    models: 'app/models',
    services: 'app/services',
    controllers: 'app/controllers',
    validators: 'app/validators',
    exceptions: 'app/exceptions',
    events: 'app/events',
    listeners: 'app/listeners',
  },

  /*
  |--------------------------------------------------------------------------
  | Preloads
  |--------------------------------------------------------------------------
  */
  preloads: [
    () => import('#start/routes'),
    () => import('#start/kernel'),
  ],

  /*
  |--------------------------------------------------------------------------
  | Meta files
  |--------------------------------------------------------------------------
  */
  metaFiles: [
    {
      pattern: 'public/**',
      reloadServer: false,
    },
  ],

  /*
  |--------------------------------------------------------------------------
  | Assets bundler
  |--------------------------------------------------------------------------
  */
  assetsBundler: false,

  /*
  |--------------------------------------------------------------------------
  | Tests
  |--------------------------------------------------------------------------
  */
  tests: {
    suites: [
      {
        files: ['tests/unit/**/*.spec.ts'],
        name: 'unit',
        timeout: 2000,
      },
      {
        files: ['tests/functional/**/*.spec.ts'],
        name: 'functional',
        timeout: 30000,
      },
    ],
    forceExit: false,
  },
})

