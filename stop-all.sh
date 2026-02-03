#!/bin/bash

# Event Management System - Stop All Services

echo "Stopping all services..."

# Kill processes by port
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8083 | xargs kill -9 2>/dev/null || true
lsof -ti:8082 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:8888 | xargs kill -9 2>/dev/null || true
lsof -ti:8761 | xargs kill -9 2>/dev/null || true

echo "All services stopped."
