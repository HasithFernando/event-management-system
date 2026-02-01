#!/bin/bash

# Event Management System - Build Script
# This script builds all services

set -e

echo "🔨 Building Event Management System..."

# Build Discovery Server
echo "📦 Building Discovery Server..."
cd discovery
mvn clean package -DskipTests
cd ..

# Build Config Server
echo "📦 Building Config Server..."
cd config-server
mvn clean package -DskipTests
cd ..

# Build API Gateway
echo "📦 Building API Gateway..."
cd gateway
mvn clean package -DskipTests
cd ..

# Build Event Service
echo "📦 Building Event Service..."
cd backend/event-service
mvn clean package -DskipTests
cd ../..

# Build User Service
echo "📦 Building User Service..."
cd backend/user-service
mvn clean package -DskipTests
cd ../..

# Build Booking Service
echo "📦 Building Booking Service..."
cd backend/booking-service
mvn clean package -DskipTests
cd ../..

# Build Frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ All services built successfully!"
echo "🚀 Run 'docker-compose up' to start the application"
