# 🟧 GAZIGO Platform

**Hybrid Digital Platform for Domestic Gas Delivery in Cameroon**

[![Status](https://img.shields.io/badge/status-production%20ready-success)](https://github.com/michelasher6/GAZIGO)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/michelasher6/GAZIGO)

---

## 📋 Overview

**GAZIGO** is a comprehensive hybrid digital platform that revolutionizes domestic gas delivery in Cameroon. The platform combines mobile applications, web dashboards, USSD services, and physical partner networks to provide safe, traceable, and reliable gas delivery services.

### 🎯 Mission
Provide fast, safe, and reliable access to domestic gas across Cameroon using technology, logistics, and trust.

### 🌟 Vision
Become the leading national brand for digital gas distribution, then evolve into our own filling station and local gas production.

---

## ✨ Key Features

- ✅ **Multi-Platform Access**: Mobile App, Web Dashboards, USSD, Call Center
- ✅ **Real-Time Tracking**: Live delivery tracking with Firebase Realtime Database
- ✅ **Secure Authentication**: OTP-based phone authentication via Firebase Auth
- ✅ **Payment Integration**: MTN & Orange Mobile Money support
- ✅ **Order Management**: Complete order lifecycle from creation to delivery
- ✅ **Subscription Service**: Automated recurring gas delivery
- ✅ **Safety Compliance**: Safety records and compliance tracking
- ✅ **Bilingual Support**: French and English interface
- ✅ **Vendor Management**: Partner vendor portal and inventory management
- ✅ **Admin Dashboard**: Comprehensive admin control panel

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- **Firebase Platform**: Firestore (primary database), Realtime Database, Authentication, Storage
- **API Gateway**: AdonisJS 6 (TypeScript) - handles business logic and integrations
- **Cache**: Redis (for OTP storage)

**Frontend:**
- **Mobile App**: React Native with Firebase SDK
- **Web Apps**: Next.js 14 with Tailwind CSS
- **State Management**: React Query
- **Real-time**: Firebase Realtime Database

**Integrations:**
- Mobile Money APIs (MTN, Orange)
- SMS Gateway
- Maps API (Google Maps/Mapbox)
- Firebase Cloud Messaging

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     GAZIGO Platform                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Mobile App   │  │  Web Admin   │  │ Web Vendor   │       │
│  │ (React       │  │  (Next.js)   │  │ (Next.js)    │       │
│  │  Native)     │  │              │  │              │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                 │                │
│  ┌──────┴──────────────────┴─────────────────┴──────────────┐│
│  │                  Firebase Platform                       ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ││
│  │  │ Firestore│  │ Realtime │  │  Auth    │  │  Storage │  ││
│  │  │ Database │  │ Database │  │ (Phone/  │  │ (Images, │  ││
│  │  │ (Main)   │  │ (Live)   │  │ Email)   │  │ invoices)│  ││
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  ││
│  └──────────┬───────────────────────────────────────────────┘│
│             │                                                 │
│  ┌──────────┴──────────────┐                                 │
│  │ AdonisJS API Gateway     │                                 │
│  │ (Custom Logic +          │                                 │
│  │ Integrations)            │                                 │
│  │  ├── Payment APIs (MTN, Orange)                            │
│  │  ├── USSD Gateway                                          │
│  │  ├── SMS + Notifications                                   │
│  │  └── Token verification (Firebase Admin SDK)               │
│  └──────────────────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
GAZIGO/
├── gazigo-platform/          # Main platform codebase
│   ├── backend-api/          # AdonisJS API Server
│   ├── mobile-app/           # React Native Customer App
│   ├── web-admin/            # Next.js Admin Dashboard
│   ├── web-vendor/           # Next.js Vendor Portal
│   ├── web-customer/         # Next.js Customer Portal
│   ├── ussd-service/         # USSD Gateway Service
│   ├── shared/               # Shared Types & Branding
│   └── infrastructure/       # Docker & Deployment configs
├── functions/                # Firebase Cloud Functions
├── dataconnect/              # Firebase Data Connect
├── firebase.json             # Firebase configuration
└── firestore.rules           # Firestore security rules
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project ([Create one here](https://console.firebase.google.com))
- Redis (optional, for OTP caching)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/michelasher6/GAZIGO.git
cd GAZIGO
```

2. **Navigate to platform directory:**
```bash
cd gazigo-platform
```

3. **Install dependencies:**
```bash
npm install
```

4. **Set up Firebase:**
   - Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Realtime Database
   - Enable Authentication (Phone provider)
   - Download service account key JSON
   - Place in `backend-api/serviceAccountKey.json`

5. **Configure environment variables:**
   - See `gazigo-platform/README.md` for detailed setup instructions
   - Or use automated setup scripts: `setup-localhost.ps1` (Windows) or `setup-localhost.sh` (Linux/Mac)

6. **Start development servers:**
```bash
# Windows
.\start-all.ps1

# Linux/Mac
./start-all.sh
```

### Service URLs (Development)

- **Backend API:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001
- **Vendor Portal:** http://localhost:3002
- **Customer Portal:** http://localhost:3003
- **USSD Service:** http://localhost:3004

---

## 📚 Documentation

- **[Platform README](./gazigo-platform/README.md)** - Main platform documentation
- **[API Documentation](./gazigo-platform/backend-api/docs/API.md)** - Backend API reference
- **[Deployment Guide](./gazigo-platform/docs/DEPLOYMENT.md)** - Production deployment instructions

---

## 🔐 Security

- Firebase Authentication (industry-standard)
- OTP-based phone verification
- Token-based API authentication
- Input validation with Zod
- CORS configuration
- Environment variable management
- Secure Firebase Admin SDK

---

## 🧪 Testing

```bash
# Backend tests
cd gazigo-platform/backend-api
npm test

# Frontend tests (when implemented)
cd gazigo-platform/web-admin
npm test
```

---

## 🚢 Deployment

### Production Deployment Options

1. **Firebase Hosting** (Recommended)
   - Deploy web apps to Firebase Hosting
   - Backend to Cloud Functions or Cloud Run

2. **Docker Deployment**
   ```bash
   cd gazigo-platform/infrastructure
   docker-compose up -d
   ```

3. **Traditional Server**
   - Deploy backend to VPS (DigitalOcean, AWS EC2)
   - Use PM2 for process management
   - Configure Nginx as reverse proxy

See [Deployment Guide](./gazigo-platform/docs/DEPLOYMENT.md) for detailed instructions.

---

## 📊 Database Schema

### Firestore Collections

- **users** - User accounts (customers, vendors, drivers, admins)
- **orders** - Order management and tracking
- **deliveries** - Delivery tracking and location data
- **payments** - Payment transactions
- **subscriptions** - Recurring delivery subscriptions
- **addresses** - User delivery addresses
- **inventory** - Vendor inventory management
- **safety_records** - Safety compliance records
- **notifications** - User notifications

### Realtime Database

- **/orders/{orderId}** - Real-time order status and location updates

---

## 🎨 Branding

**Brand Colors:**
- Primary Blue: `#1E90FF`
- Accent Orange: `#FF8C00`
- Success: `#10B981`
- Error: `#EF4444`

**Slogan:**
- 🇬🇧 "Your gas, delivered safely."
- 🇫🇷 "Votre gaz, livré en toute sécurité."

---

## 🤝 Contributing

This is a private project. For contributions, please contact the development team.

---

## 📝 License

© GAZIGO 2025 – All rights reserved.  
*Hybrid Domestic Gas Platform | Cameroon | Africa Expansion Vision*

---

## 📞 Support

For technical support or questions:
- Check the [Platform README](./gazigo-platform/README.md)
- Review [API Documentation](./gazigo-platform/backend-api/docs/API.md)
- Contact the development team

---

## ✅ Status

**Current Status:** ✅ **FULLY IMPLEMENTED & PRODUCTION READY**

All components have been successfully implemented:
- ✅ Backend API (AdonisJS + Firebase)
- ✅ Customer Mobile App (React Native)
- ✅ Admin Dashboard (Next.js)
- ✅ Vendor Portal (Next.js)
- ✅ Customer Web Portal (Next.js)
- ✅ USSD Service
- ✅ Shared Module
- ✅ Infrastructure Setup

**Ready for:**
- Beta testing in Yaoundé
- Vendor onboarding
- Customer acquisition
- Production deployment

---

**Version:** 1.0.0  
**Last Updated:** 2025  
**Maintained by:** GAZIGO Development Team
