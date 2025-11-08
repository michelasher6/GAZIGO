# GAZIGO Platform - Firebase Setup Script
# This script configures Firebase and creates .env files

Write-Host "🔥 Setting up Firebase for GAZIGO Platform..." -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Firebase project details
$projectId = "gazigo-plateform"
$projectNumber = "49049205318"

Write-Host "`n📋 Project Details:" -ForegroundColor Yellow
Write-Host "   Project ID: $projectId" -ForegroundColor White
Write-Host "   Project Number: $projectNumber" -ForegroundColor White

# Get Realtime Database URL
$realtimeDbUrl = "https://$projectId-default-rtdb.firebaseio.com"
Write-Host "`n🔗 Realtime Database URL: $realtimeDbUrl" -ForegroundColor Green

# Check if service account key exists
$serviceAccountPath = "$projectRoot\backend-api\serviceAccountKey.json"
if (-not (Test-Path $serviceAccountPath)) {
    Write-Host "`n⚠️  Service account key not found at: $serviceAccountPath" -ForegroundColor Yellow
    Write-Host "   Please download it from Firebase Console:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://console.firebase.google.com/project/$projectId/settings/serviceaccounts/adminsdk" -ForegroundColor Cyan
    Write-Host "   2. Click 'Generate new private key'" -ForegroundColor Cyan
    Write-Host "   3. Save as: $serviceAccountPath" -ForegroundColor Cyan
    Write-Host "`n   Or run this command to get it via CLI:" -ForegroundColor Yellow
    Write-Host "   firebase projects:list" -ForegroundColor Cyan
} else {
    Write-Host "`n✅ Service account key found!" -ForegroundColor Green
    # Read service account to get email
    $serviceAccount = Get-Content $serviceAccountPath | ConvertFrom-Json
    $clientEmail = $serviceAccount.client_email
    Write-Host "   Client Email: $clientEmail" -ForegroundColor White
}

# Create backend-api/.env
Write-Host "`n📝 Creating backend-api/.env..." -ForegroundColor Yellow
$backendEnv = @"
# Firebase Configuration
FIREBASE_PROJECT_ID=$projectId
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=""
FIREBASE_DATABASE_URL=$realtimeDbUrl
FIREBASE_REALTIME_DB_URL=$realtimeDbUrl
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Redis Configuration
REDIS_URL=redis://localhost:6379

# OTP Configuration
OTP_EXPIRES_IN=300
OTP_LENGTH=6

# API Keys (for production - add your keys here)
MTN_MOBILE_MONEY_API_KEY=your-mtn-api-key
ORANGE_MONEY_API_KEY=your-orange-api-key
SMS_API_KEY=your-sms-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3002,http://localhost:3003
"@

if (Test-Path $serviceAccountPath) {
    $serviceAccount = Get-Content $serviceAccountPath | ConvertFrom-Json
    $privateKey = $serviceAccount.private_key -replace "`n", "\n"
    $clientEmail = $serviceAccount.client_email
    
    $backendEnv = $backendEnv -replace 'FIREBASE_PRIVATE_KEY=""', "FIREBASE_PRIVATE_KEY=`"$privateKey`""
    $backendEnv = $backendEnv -replace 'FIREBASE_CLIENT_EMAIL=""', "FIREBASE_CLIENT_EMAIL=$clientEmail"
}

$backendEnvPath = Join-Path $projectRoot "backend-api" | Join-Path -ChildPath ".env"
$backendEnv | Out-File -FilePath $backendEnvPath -Encoding utf8 -NoNewline
Write-Host "   ✅ Created backend-api/.env" -ForegroundColor Green

# Create web-admin/.env.local
Write-Host "`n📝 Creating web-admin/.env.local..." -ForegroundColor Yellow
$adminEnv = "NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api"
$adminEnvPath = Join-Path $projectRoot "web-admin" | Join-Path -ChildPath ".env.local"
$adminEnv | Out-File -FilePath $adminEnvPath -Encoding utf8
Write-Host "   ✅ Created web-admin/.env.local" -ForegroundColor Green

# Create web-vendor/.env.local
Write-Host "`n📝 Creating web-vendor/.env.local..." -ForegroundColor Yellow
$vendorEnv = "NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api"
$vendorEnvPath = Join-Path $projectRoot "web-vendor" | Join-Path -ChildPath ".env.local"
$vendorEnv | Out-File -FilePath $vendorEnvPath -Encoding utf8
Write-Host "   ✅ Created web-vendor/.env.local" -ForegroundColor Green

# Create web-customer/.env.local
Write-Host "`n📝 Creating web-customer/.env.local..." -ForegroundColor Yellow
$customerEnv = "NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api"
$customerEnvPath = Join-Path $projectRoot "web-customer" | Join-Path -ChildPath ".env.local"
$customerEnv | Out-File -FilePath $customerEnvPath -Encoding utf8
Write-Host "   ✅ Created web-customer/.env.local" -ForegroundColor Green

# Create mobile-app/.env
Write-Host "`n📝 Creating mobile-app/.env..." -ForegroundColor Yellow
$mobileEnv = "API_BASE_URL=http://localhost:3000/api"
$mobileEnvPath = Join-Path $projectRoot "mobile-app" | Join-Path -ChildPath ".env"
$mobileEnv | Out-File -FilePath $mobileEnvPath -Encoding utf8
Write-Host "   ✅ Created mobile-app/.env" -ForegroundColor Green

# Create ussd-service/.env
Write-Host "`n📝 Creating ussd-service/.env..." -ForegroundColor Yellow
$ussdEnv = "API_BASE_URL=http://localhost:3000/api`nPORT=3004"
$ussdEnvPath = Join-Path $projectRoot "ussd-service" | Join-Path -ChildPath ".env"
$ussdEnv | Out-File -FilePath $ussdEnvPath -Encoding utf8
Write-Host "   ✅ Created ussd-service/.env" -ForegroundColor Green

Write-Host "`n✅ Firebase setup complete!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Ensure serviceAccountKey.json is in backend-api/ folder" -ForegroundColor White
Write-Host "   2. Install dependencies: npm install" -ForegroundColor White
Write-Host "   3. Start Redis: redis-server" -ForegroundColor White
Write-Host "   4. Start services: .\start-all.ps1" -ForegroundColor White

