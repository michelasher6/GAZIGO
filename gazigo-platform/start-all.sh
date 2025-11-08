#!/bin/bash

# GAZIGO Platform - Start All Services Script
# This script starts all services for local development

echo "🚀 Starting GAZIGO Platform Services..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Get project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to start a service in background
start_service() {
    local name=$1
    local path=$2
    local command=$3
    
    echo "📦 Starting $name..."
    cd "$PROJECT_ROOT/$path"
    nohup bash -c "$command" > "/tmp/gazigo-$name.log" 2>&1 &
    echo $! > "/tmp/gazigo-$name.pid"
    sleep 2
}

# Start Backend API (Port 3000)
echo ""
echo "🔧 Starting Backend API..."
start_service "backend-api" "backend-api" "npm run dev"

# Start Admin Dashboard (Port 3001)
echo ""
echo "📊 Starting Admin Dashboard..."
start_service "web-admin" "web-admin" "npm run dev"

# Start Vendor Dashboard (Port 3002)
echo ""
echo "🏪 Starting Vendor Dashboard..."
start_service "web-vendor" "web-vendor" "npm run dev"

# Start Customer Portal (Port 3003)
echo ""
echo "👤 Starting Customer Portal..."
start_service "web-customer" "web-customer" "npm run dev"

# Start USSD Service (Port 3004)
echo ""
echo "📱 Starting USSD Service..."
start_service "ussd-service" "ussd-service" "npm run dev"

echo ""
echo "✅ All services are starting!"
echo ""
echo "📍 Service URLs:"
echo "   Backend API:     http://localhost:3000"
echo "   Admin Dashboard: http://localhost:3001"
echo "   Vendor Portal:   http://localhost:3002"
echo "   Customer Portal: http://localhost:3003"
echo "   USSD Service:    http://localhost:3004"
echo ""
echo "💡 Note: Make sure Redis is running for OTP functionality"
echo "   Run: redis-server"
echo ""
echo "📝 Logs are available in /tmp/gazigo-*.log"
echo "🛑 To stop all services, run: ./stop-all.sh"

