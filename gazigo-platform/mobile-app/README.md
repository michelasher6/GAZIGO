# GAZIGO Mobile App

React Native mobile application for GAZIGO customers.

## Features

- User authentication (OTP-based)
- Order placement and management
- Real-time order tracking
- Payment integration (Mobile Money)
- Bilingual support (French/English)
- Order history

## Setup

1. Install dependencies:
```bash
npm install
```

2. For iOS:
```bash
cd ios && pod install && cd ..
```

3. Run the app:
```bash
# iOS
npm run ios

# Android
npm run android
```

## Environment

Create a `.env` file:
```
API_BASE_URL=http://localhost:3000/api
```

## Project Structure

- `src/screens/` - Screen components
- `src/components/` - Reusable components
- `src/services/` - API services
- `src/navigation/` - Navigation setup
- `src/contexts/` - React contexts
- `src/i18n/` - Internationalization
- `src/theme/` - Theme configuration

