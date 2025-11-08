#!/bin/bash

# GAZIGO Platform - Localhost Setup Script (Linux/macOS)
# This script helps set up the Firebase-centric architecture for localhost deployment

echo "🚀 GAZIGO Platform - Localhost Setup"
echo "====================================="
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Check if Node.js is installed
echo "📦 Checking prerequisites..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js: $NODE_VERSION"
else
    echo "   ❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check if Firebase CLI is installed
if command -v firebase &> /dev/null; then
    FIREBASE_VERSION=$(firebase --version)
    echo "   ✅ Firebase CLI: $FIREBASE_VERSION"
else
    echo "   ⚠️  Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo ""
echo "📝 Step 1: Firebase Project Configuration"
echo "========================================="
echo ""
echo "Please provide your Firebase project details:"
echo ""

read -p "Firebase Project ID: " PROJECT_ID
read -p "Realtime Database URL (e.g., https://your-project-default-rtdb.firebaseio.com): " REALTIME_DB_URL

echo ""
echo "📋 Step 2: Firebase Web App Configuration"
echo "=========================================="
echo ""
echo "Get these values from Firebase Console → Project Settings → Your apps → Web app"
echo ""

read -p "Firebase API Key: " API_KEY
read -p "Firebase Auth Domain: " AUTH_DOMAIN
read -p "Firebase Storage Bucket: " STORAGE_BUCKET
read -p "Firebase Messaging Sender ID: " MESSAGING_SENDER_ID
read -p "Firebase App ID: " APP_ID

echo ""
echo "📁 Step 3: Service Account Key"
echo "=============================="
echo ""
echo "Place your serviceAccountKey.json file in the backend-api/ directory"
SERVICE_ACCOUNT_PATH="$PROJECT_ROOT/backend-api/serviceAccountKey.json"

if [ -f "$SERVICE_ACCOUNT_PATH" ]; then
    echo "   ✅ Found serviceAccountKey.json"
    PRIVATE_KEY=$(node -e "const fs = require('fs'); const sa = JSON.parse(fs.readFileSync('$SERVICE_ACCOUNT_PATH', 'utf8')); console.log(sa.private_key.replace(/\n/g, '\\n'))")
    CLIENT_EMAIL=$(node -e "const fs = require('fs'); const sa = JSON.parse(fs.readFileSync('$SERVICE_ACCOUNT_PATH', 'utf8')); console.log(sa.client_email)")
else
    echo "   ⚠️  serviceAccountKey.json not found"
    echo "   You'll need to manually add Firebase credentials to backend-api/.env"
    PRIVATE_KEY=""
    CLIENT_EMAIL=""
fi

echo ""
echo "🔧 Step 4: Creating Environment Files"
echo "====================================="
echo ""

# Backend API .env
echo "Creating backend-api/.env..."
cat > "$PROJECT_ROOT/backend-api/.env" << EOF
# Firebase Configuration
FIREBASE_PROJECT_ID=$PROJECT_ID
FIREBASE_PRIVATE_KEY="$PRIVATE_KEY"
FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL
FIREBASE_DATABASE_URL=$REALTIME_DB_URL
FIREBASE_REALTIME_DB_URL=$REALTIME_DB_URL
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# OTP Configuration
OTP_EXPIRES_IN=300
OTP_LENGTH=6

# API Keys (Add your keys when available)
MTN_MOBILE_MONEY_API_KEY=your-mtn-api-key
ORANGE_MONEY_API_KEY=your-orange-api-key
SMS_API_KEY=your-sms-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004
EOF
echo "   ✅ Created backend-api/.env"

# Web Admin .env.local
echo "Creating web-admin/.env.local..."
cat > "$PROJECT_ROOT/web-admin/.env.local" << EOF
# API Gateway URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$APP_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL=$REALTIME_DB_URL
EOF
echo "   ✅ Created web-admin/.env.local"

# Web Vendor .env.local
echo "Creating web-vendor/.env.local..."
cat > "$PROJECT_ROOT/web-vendor/.env.local" << EOF
# API Gateway URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$APP_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL=$REALTIME_DB_URL
EOF
echo "   ✅ Created web-vendor/.env.local"

# Web Customer .env.local
echo "Creating web-customer/.env.local..."
cat > "$PROJECT_ROOT/web-customer/.env.local" << EOF
# API Gateway URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$APP_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL=$REALTIME_DB_URL
EOF
echo "   ✅ Created web-customer/.env.local"

# Mobile App .env
echo "Creating mobile-app/.env..."
cat > "$PROJECT_ROOT/mobile-app/.env" << EOF
# API Gateway URL
API_BASE_URL=http://localhost:3000/api

# Firebase Configuration
FIREBASE_API_KEY=$API_KEY
FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
FIREBASE_PROJECT_ID=$PROJECT_ID
FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
FIREBASE_APP_ID=$APP_ID
FIREBASE_DATABASE_URL=$REALTIME_DB_URL
EOF
echo "   ✅ Created mobile-app/.env"

# USSD Service .env
echo "Creating ussd-service/.env..."
cat > "$PROJECT_ROOT/ussd-service/.env" << EOF
# API Gateway URL
API_BASE_URL=http://localhost:3000/api
PORT=3004
EOF
echo "   ✅ Created ussd-service/.env"

echo ""
echo "📦 Step 5: Installing Dependencies"
echo "==================================="
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install workspace dependencies
WORKSPACES=("backend-api" "mobile-app" "web-admin" "web-vendor" "web-customer" "ussd-service" "shared")

for workspace in "${WORKSPACES[@]}"; do
    WORKSPACE_PATH="$PROJECT_ROOT/$workspace"
    if [ -d "$WORKSPACE_PATH" ]; then
        echo "Installing dependencies for $workspace..."
        cd "$WORKSPACE_PATH"
        npm install
    fi
done

cd "$PROJECT_ROOT"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Ensure Redis is running (optional): docker run -d -p 6379:6379 redis:alpine"
echo "2. Start the backend API: cd backend-api && npm run dev"
echo "3. Start web applications: cd web-admin && npm run dev"
echo "4. Or use the start-all script: ./start-all.sh"
echo ""
echo "📚 For detailed instructions, see LOCALHOST_DEPLOYMENT.md"
echo ""

