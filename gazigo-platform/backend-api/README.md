# GAZIGO Backend API - AdonisJS with Firebase

Backend API server for the GAZIGO platform built with AdonisJS and Firebase.

## Technology Stack

- **Framework**: AdonisJS 6 (TypeScript-first)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Real-time**: Firebase Realtime Database
- **Cache**: Redis (for OTP storage)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

3. Firebase Setup:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Enable Realtime Database
   - Enable Authentication (Phone provider)
   - Download service account key JSON file
   - Set `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env` or provide individual credentials

4. Start Redis:
```bash
redis-server
```

5. Run the server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Firebase Configuration

### Firestore Collections

The following collections are used:
- `users` - User accounts
- `orders` - Orders
- `deliveries` - Delivery tracking
- `payments` - Payment records
- `subscriptions` - Recurring orders
- `addresses` - User addresses
- `inventory` - Vendor inventory
- `safety_records` - Safety compliance records
- `notifications` - User notifications

### Firebase Auth

Authentication uses Firebase Auth with phone number provider. Custom tokens are generated for client authentication.

### Realtime Database

Real-time order tracking uses Firebase Realtime Database at path `/orders/{orderId}`.

## API Endpoints

See `docs/API.md` for complete API documentation.

## Project Structure

```
backend-api/
├── app/
│   ├── controllers/     # HTTP controllers
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── middleware/      # HTTP middleware
│   └── utils/           # Utility functions
├── config/              # Configuration files
├── start/               # Application entrypoints
│   ├── routes.ts        # Route definitions
│   └── kernel.ts       # Middleware setup
└── server.ts           # Server entrypoint
```

## Development

AdonisJS provides:
- Hot module replacement (HMR)
- TypeScript support
- Built-in validation
- MVC architecture

## References

- [AdonisJS Documentation](https://docs.adonisjs.com)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
