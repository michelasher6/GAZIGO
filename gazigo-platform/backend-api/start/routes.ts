import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const OrderController = () => import('#controllers/order_controller')
const PaymentController = () => import('#controllers/payment_controller')
const TrackingController = () => import('#controllers/tracking_controller')
const SubscriptionController = () => import('#controllers/subscription_controller')
const SafetyController = () => import('#controllers/safety_controller')

// Health check
router.get('/api/health', async ({ response }) => {
  return response.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth routes
router.group(() => {
  router.post('/send-otp', [AuthController, 'sendOTP'])
  router.post('/verify-otp', [AuthController, 'verifyOTP'])
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
  router.post('/authenticate', [AuthController, 'authenticate'])
}).prefix('/api/auth')

// Order routes (protected)
router.group(() => {
  router.post('/', [OrderController, 'create'])
  router.get('/', [OrderController, 'index'])
  router.get('/:id', [OrderController, 'show'])
  router.patch('/:id/status', [OrderController, 'updateStatus'])
}).prefix('/api/orders').use(middleware.auth())

// Payment routes (protected)
router.group(() => {
  router.post('/', [PaymentController, 'process'])
  router.patch('/:id/status', [PaymentController, 'updateStatus'])
}).prefix('/api/payments').use(middleware.auth())

// Tracking routes (protected)
router.group(() => {
  router.get('/:id', [TrackingController, 'show'])
  router.patch('/:id/location', [TrackingController, 'updateLocation'])
  router.patch('/:id/status', [TrackingController, 'updateStatus'])
}).prefix('/api/tracking').use(middleware.auth())

// Subscription routes (protected)
router.group(() => {
  router.post('/', [SubscriptionController, 'create'])
  router.get('/', [SubscriptionController, 'index'])
  router.delete('/:id', [SubscriptionController, 'destroy'])
}).prefix('/api/subscriptions').use(middleware.auth())

// Safety routes (protected)
router.group(() => {
  router.post('/', [SafetyController, 'create'])
  router.get('/', [SafetyController, 'index'])
  router.get('/vendor/:vendorId', [SafetyController, 'vendorCompliance'])
}).prefix('/api/safety').use(middleware.auth())

