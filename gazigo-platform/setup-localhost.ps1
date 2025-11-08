# GAZIGO Platform - Localhost Setup Script
# This script helps set up the Firebase-centric architecture for localhost deployment

Write-Host "GAZIGO Platform - Localhost Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version
    Write-Host "   Firebase CLI: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "   Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

Write-Host ""
Write-Host "Step 1: Firebase Project Configuration" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please provide your Firebase project details:" -ForegroundColor White
Write-Host ""

$projectId = Read-Host "Firebase Project ID"
$realtimeDbUrl = Read-Host "Realtime Database URL (e.g., https://your-project-default-rtdb.firebaseio.com)"

Write-Host ""
Write-Host "Step 2: Firebase Web App Configuration" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Get these values from Firebase Console → Project Settings → Your apps → Web app" -ForegroundColor White
Write-Host ""

$apiKey = Read-Host "Firebase API Key"
$authDomain = Read-Host "Firebase Auth Domain"
$storageBucket = Read-Host "Firebase Storage Bucket"
$messagingSenderId = Read-Host "Firebase Messaging Sender ID"
$appId = Read-Host "Firebase App ID"

Write-Host ""
Write-Host "Step 3: Service Account Key" -ForegroundColor Yellow
Write-Host "==============================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Place your serviceAccountKey.json file in the backend-api/ directory" -ForegroundColor White
$serviceAccountPath = Join-Path $projectRoot "backend-api" | Join-Path -ChildPath "serviceAccountKey.json"

if (Test-Path $serviceAccountPath) {
    Write-Host "   Found serviceAccountKey.json" -ForegroundColor Green
    $serviceAccount = Get-Content $serviceAccountPath | ConvertFrom-Json
    $privateKey = $serviceAccount.private_key -replace "`n", "\n"
    $clientEmail = $serviceAccount.client_email
} else {
    Write-Host "   serviceAccountKey.json not found" -ForegroundColor Yellow
    Write-Host "   You'll need to manually add Firebase credentials to backend-api/.env" -ForegroundColor Yellow
    $privateKey = ""
    $clientEmail = ""
}

Write-Host ""
Write-Host "Step 4: Creating Environment Files" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
Write-Host ""

# Backend API .env
Write-Host "Creating backend-api/.env..." -ForegroundColor White
$backendEnv = @"
# Firebase Configuration
FIREBASE_PROJECT_ID=$projectId
FIREBASE_PRIVATE_KEY=`"$privateKey`"
FIREBASE_CLIENT_EMAIL=$clientEmail
FIREBASE_DATABASE_URL=$realtimeDbUrl
FIREBASE_REALTIME_DB_URL=$realtimeDbUrl
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
"@

$backendEnvPath = Join-Path $projectRoot "backend-api" | Join-Path -ChildPath ".env"
$backendEnv | Out-File -FilePath $backendEnvPath -Encoding utf8 -NoNewline
Write-Host "   Created backend-api/.env" -ForegroundColor Green

# Web Admin .env.local
Write-Host "Creating web-admin/.env.local..." -ForegroundColor White
$adminEnv = @"
# API Gateway URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=$appId
NEXT_PUBLIC_FIREBASE_DATABASE_URL=$realtimeDbUrl
"@

$adminEnvPath = Join-Path $projectRoot "web-admin" | Join-Path -ChildPath ".env.local"
$adminEnv | Out-File -FilePath $adminEnvPath -Encoding utf8
Write-Host "   Created web-admin/.env.local" -ForegroundColor Green

# Web Vendor .env.local
Write-Host "Creating web-vendor/.env.local..." -ForegroundColor White
$vendorEnv = @"
# API Gateway URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=$appId
NEXT_PUBLIC_FIREBASE_DATABASE_URL=$realtimeDbUrl
"@

$vendorEnvPath = Join-Path $projectRoot "web-vendor" | Join-Path -ChildPath ".env.local"
$vendorEnv | Out-File -FilePath $vendorEnvPath -Encoding utf8
Write-Host "   Created web-vendor/.env.local" -ForegroundColor Green

# Web Customer .env.local
Write-Host "Creating web-customer/.env.local..." -ForegroundColor White
$customerEnv = @"
# API Gateway URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=$appId
NEXT_PUBLIC_FIREBASE_DATABASE_URL=$realtimeDbUrl
"@

$customerEnvPath = Join-Path $projectRoot "web-customer" | Join-Path -ChildPath ".env.local"
$customerEnv | Out-File -FilePath $customerEnvPath -Encoding utf8
Write-Host "   Created web-customer/.env.local" -ForegroundColor Green

# Mobile App .env
Write-Host "Creating mobile-app/.env..." -ForegroundColor White
$mobileEnv = @"
# API Gateway URL
API_BASE_URL=http://localhost:3000/api

# Firebase Configuration
FIREBASE_API_KEY=$apiKey
FIREBASE_AUTH_DOMAIN=$authDomain
FIREBASE_PROJECT_ID=$projectId
FIREBASE_STORAGE_BUCKET=$storageBucket
FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
FIREBASE_APP_ID=$appId
FIREBASE_DATABASE_URL=$realtimeDbUrl
"@

$mobileEnvPath = Join-Path $projectRoot "mobile-app" | Join-Path -ChildPath ".env"
$mobileEnv | Out-File -FilePath $mobileEnvPath -Encoding utf8
Write-Host "   Created mobile-app/.env" -ForegroundColor Green

# USSD Service .env
Write-Host "Creating ussd-service/.env..." -ForegroundColor White
$ussdEnv = @"
# API Gateway URL
API_BASE_URL=http://localhost:3000/api
PORT=3004
"@

$ussdEnvPath = Join-Path $projectRoot "ussd-service" | Join-Path -ChildPath ".env"
$ussdEnv | Out-File -FilePath $ussdEnvPath -Encoding utf8
Write-Host "   Created ussd-service/.env" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Installing Dependencies" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow
Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor White
npm install

# Install workspace dependencies
$workspaces = @("backend-api", "mobile-app", "web-admin", "web-vendor", "web-customer", "ussd-service", "shared")

foreach ($workspace in $workspaces) {
    $workspacePath = Join-Path $projectRoot $workspace
    if (Test-Path $workspacePath) {
        Write-Host "Installing dependencies for $workspace..." -ForegroundColor White
        Set-Location $workspacePath
        npm install
    }
}

Set-Location $projectRoot

Write-Host ""
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure Redis is running (optional): docker run -d -p 6379:6379 redis:alpine" -ForegroundColor White
Write-Host "2. Start the backend API: cd backend-api && npm run dev" -ForegroundColor White
Write-Host "3. Start web applications: cd web-admin && npm run dev" -ForegroundColor White
Write-Host "4. Or use the start-all script: .\start-all.ps1" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see LOCALHOST_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""