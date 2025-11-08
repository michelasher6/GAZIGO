# 🟧 GAZIGO Platform

**Complete hybrid digital platform for domestic gas delivery in Cameroon**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (create at [console.firebase.google.com](https://console.firebase.google.com))
- Redis (optional, for OTP caching)

### Installation

**Option 1: Automated Setup (Recommended)**

Run the setup script to configure everything automatically:

**Windows:**
```powershell
.\setup-localhost.ps1
```

**Linux/Mac:**
```bash
chmod +x setup-localhost.sh
./setup-localhost.sh
```

**Option 2: Manual Setup**

1. **Install dependencies:**
```bash
cd gazigo-platform
npm install
```

2. **Set up Firebase:**
   - Create Firebase project
   - Enable Firestore, Realtime Database, and Authentication
   - Download service account key to `backend-api/serviceAccountKey.json`

3. **Configure environment variables:**
   - See [LOCALHOST_DEPLOYMENT.md](./LOCALHOST_DEPLOYMENT.md) for detailed instructions
   - Or use the setup script above

4. **Start services:**

**Windows:**
```powershell
.\start-all.ps1
```

**Linux/Mac:**
```bash
./start-all.sh
```

**Or manually:**
```bash
# Terminal 1 - Backend API
cd backend-api && npm run dev

# Terminal 2 - Admin Dashboard
cd web-admin && npm run dev

# Terminal 3 - Vendor Dashboard
cd web-vendor && npm run dev

# Terminal 4 - Customer Portal
cd web-customer && npm run dev
```

📚 **For detailed setup instructions, see:**
- [QUICK_START.md](./QUICK_START.md) - 5-minute quick start
- [LOCALHOST_DEPLOYMENT.md](./LOCALHOST_DEPLOYMENT.md) - Complete deployment guide

## 📍 Service URLs

- **Backend API:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001
- **Vendor Portal:** http://localhost:3002
- **Customer Portal:** http://localhost:3003
- **USSD Service:** http://localhost:3004

## 📁 Project Structure

```
gazigo-platform/
├── backend-api/        # AdonisJS API Server
├── mobile-app/         # React Native Customer App
├── web-admin/          # Next.js Admin Dashboard
├── web-vendor/         # Next.js Vendor Portal
├── web-customer/       # Next.js Customer Portal
├── ussd-service/       # USSD Gateway Service
├── shared/             # Shared Types & Branding
└── infrastructure/     # Docker & CI/CD configs
```

## 🛠️ Technology Stack

### Architecture: Firebase-Centric + AdonisJS Gateway

- **Firebase Platform:** Firestore, Auth, Realtime Database, Storage
- **API Gateway:** AdonisJS 6 (TypeScript) - handles integrations (Payments, SMS, USSD)
- **Mobile:** React Native + Firebase SDK
- **Web:** Next.js 14 + Firebase SDK + Tailwind CSS
- **Real-time:** Firebase Realtime Database
- **Cache:** Redis (optional, for OTP)

## 📚 Documentation

- [QUICK_START.md](./QUICK_START.md) - Get started in 5 minutes
- [LOCALHOST_DEPLOYMENT.md](./LOCALHOST_DEPLOYMENT.md) - Complete localhost setup guide
- [COMPLETE_PLATFORM_SUMMARY.md](./COMPLETE_PLATFORM_SUMMARY.md) - Full platform documentation
- [API Documentation](./backend-api/docs/API.md) - Backend API reference
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## ✅ Features

- ✅ OTP-based authentication
- ✅ Order management & tracking
- ✅ Real-time delivery tracking
- ✅ Payment integration (MTN/Orange Mobile Money)
- ✅ Subscription management
- ✅ Multi-platform support (Web, Mobile, USSD)
- ✅ Bilingual (French/English)
- ✅ Safety & compliance tracking

## 🧪 Testing

```bash
# Backend tests
cd backend-api && npm test

# Frontend tests (when implemented)
cd web-admin && npm test
```

## 📝 License

© GAZIGO 2025 – All rights reserved.
