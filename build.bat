@echo off
REM Event Management System - Build Script for Windows
REM This script builds all services

echo Building Event Management System...

REM Build Discovery Server
echo Building Discovery Server...
cd discovery
call mvn clean package -DskipTests
cd ..

REM Build Config Server
echo Building Config Server...
cd config-server
call mvn clean package -DskipTests
cd ..

REM Build API Gateway
echo Building API Gateway...
cd gateway
call mvn clean package -DskipTests
cd ..

REM Build Event Service
echo Building Event Service...
cd backend\event-service
call mvn clean package -DskipTests
cd ..\..

REM Build User Service
echo Building User Service...
cd backend\user-service
call mvn clean package -DskipTests
cd ..\..

REM Build Booking Service
echo Building Booking Service...
cd backend\booking-service
call mvn clean package -DskipTests
cd ..\..

REM Build Frontend
echo Building Frontend...
cd frontend
call npm install
call npm run build
cd ..

echo All services built successfully!
echo Run 'docker-compose up' to start the application

pause
