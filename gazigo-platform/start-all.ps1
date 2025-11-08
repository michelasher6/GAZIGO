# GAZIGO Platform - Start All Services Script
# This script starts all services for local development

Write-Host "`nStarting GAZIGO Platform Services..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Function to start a service in a new window
function Start-Service {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command
    )
    
    # Validate path exists
    if (-not (Test-Path $Path)) {
        Write-Host "Path not found: $Path" -ForegroundColor Red
        return
    }

    # Change to directory and run command
    $arg = "-NoExit", "-Command", "
        try {
            Set-Location '$Path' -ErrorAction Stop
            Write-Host 'Starting $Name...' -ForegroundColor Green
            Write-Host 'Directory: $(Get-Location)' -ForegroundColor DarkGray

            # Check if npm script exists
            if ('$Command' -like 'npm run *') {
                \$scriptName = '$Command' -replace 'npm run ', ''
                if (-not (Get-Content 'package.json' -ErrorAction SilentlyContinue | Select-String '`"\\\$scriptName\\`' )) {
                    Write-Host 'npm script not found: \$scriptName' -ForegroundColor Red
                    Write-Host 'Available scripts:' -ForegroundColor Yellow
                    npm run
                    return
                }
            }

            $Command
        } catch {
            Write-Host 'Failed to start $Name': `$_ -ForegroundColor Red
        }
    "
    Start-Process powershell -ArgumentList $arg
    Start-Sleep -Seconds 2
}

# === SET PROJECT ROOT CORRECTLY ===
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir  # Go up one level if script is in subfolder

# If script is in root, use it directly
if (-not (Test-Path "$projectRoot\gazigo-platform")) {
    $projectRoot = $scriptDir  # Fallback
}

Set-Location $projectRoot

Write-Host "Project Root: $projectRoot" -ForegroundColor DarkGray

# === START SERVICES WITH CORRECT RELATIVE PATHS ===
$base = "$projectRoot\gazigo-platform"

Write-Host "`nStarting Backend API..." -ForegroundColor Cyan
Start-Service -Name "Backend API" -Path "$base\backend-api" -Command "npm run dev"

Write-Host "`nStarting Admin Dashboard..." -ForegroundColor Cyan
Start-Service -Name "Admin Dashboard" -Path "$base\web-admin" -Command "npm run dev"

Write-Host "`nStarting Vendor Dashboard..." -ForegroundColor Cyan
Start-Service -Name "Vendor Dashboard" -Path "$base\web-vendor" -Command "npm run dev"

Write-Host "`nStarting Customer Portal..." -ForegroundColor Cyan
Start-Service -Name "Customer Portal" -Path "$base\web-customer" -Command "npm run dev"

Write-Host "`nStarting USSD Service..." -ForegroundColor Cyan
Start-Service -Name "USSD Service" -Path "$base\ussd-service" -Command "npm run dev"

# Final message
Write-Host "`nAll services launched!" -ForegroundColor Green
Write-Host "`nService URLs:" -ForegroundColor Cyan
Write-Host "   Backend API:     http://localhost:3000" -ForegroundColor White
Write-Host "   Admin Dashboard: http://localhost:3001" -ForegroundColor White
Write-Host "   Vendor Portal:   http://localhost:3002" -ForegroundColor White
Write-Host "   Customer Portal: http://localhost:3003" -ForegroundColor White
Write-Host "   USSD Service:    http://localhost:3004" -ForegroundColor White
Write-Host "`nTip: Run 'redis-server' in a separate terminal for OTP" -ForegroundColor Yellow