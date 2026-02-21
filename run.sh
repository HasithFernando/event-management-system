#!/bin/bash

# Event Management System - Quick Start Script
# This script helps you quickly start, stop, and manage the application

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║   Event Management System - Quick Start Tool        ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
}

# Function to start all services
start_all() {
    echo -e "${YELLOW}Starting all services...${NC}"
    check_docker
    docker-compose up --build -d
    echo -e "${GREEN}✓ All services started!${NC}"
    echo ""
    show_status
}

# Function to stop all services
stop_all() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ All services stopped!${NC}"
}

# Function to restart all services
restart_all() {
    echo -e "${YELLOW}Restarting all services...${NC}"
    docker-compose restart
    echo -e "${GREEN}✓ All services restarted!${NC}"
}

# Function to show service status
show_status() {
    echo -e "${YELLOW}Service Status:${NC}"
    docker-compose ps
    echo ""
    echo -e "${GREEN}Access Points:${NC}"
    echo "  Frontend:   http://localhost:3000"
    echo "  API Gateway: http://localhost:8080"
    echo "  Eureka:     http://localhost:8761"
}

# Function to show logs
show_logs() {
    if [ -z "$1" ]; then
        echo -e "${YELLOW}Showing logs for all services (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
    else
        echo -e "${YELLOW}Showing logs for $1 (Ctrl+C to exit)...${NC}"
        docker-compose logs -f "$1"
    fi
}

# Function to clean everything
clean_all() {
    echo -e "${RED}Warning: This will remove all containers, volumes, and data!${NC}"
    read -p "Are you sure? (yes/no): " -r
    if [[ $REPLY =~ ^[Yy]es$ ]]; then
        docker-compose down -v
        echo -e "${GREEN}✓ All services and data cleaned!${NC}"
    else
        echo "Cancelled."
    fi
}

# Function to rebuild a specific service
rebuild_service() {
    if [ -z "$1" ]; then
        echo -e "${RED}Error: Please specify a service name${NC}"
        echo "Available services: frontend, gateway, user-service, event-service, booking-service, etc."
        exit 1
    fi
    echo -e "${YELLOW}Rebuilding $1...${NC}"
    docker-compose up --build -d "$1"
    echo -e "${GREEN}✓ $1 rebuilt!${NC}"
}

# Function to open shell in container
exec_shell() {
    if [ -z "$1" ]; then
        echo -e "${RED}Error: Please specify a service name${NC}"
        exit 1
    fi
    docker-compose exec "$1" /bin/bash || docker-compose exec "$1" /bin/sh
}

# Function to run frontend locally
run_frontend_local() {
    echo -e "${YELLOW}Starting frontend in development mode...${NC}"
    cd frontend
    echo "Installing dependencies..."
    npm install
    echo "Starting dev server..."
    npm run dev
}

# Main menu
case "${1:-menu}" in
    start)
        start_all
        ;;
    stop)
        stop_all
        ;;
    restart)
        restart_all
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    clean)
        clean_all
        ;;
    rebuild)
        rebuild_service "$2"
        ;;
    shell)
        exec_shell "$2"
        ;;
    dev)
        run_frontend_local
        ;;
    menu|*)
        echo "Usage: $0 {command} [options]"
        echo ""
        echo "Commands:"
        echo "  start          - Start all services with Docker Compose"
        echo "  stop           - Stop all services"
        echo "  restart        - Restart all services"
        echo "  status         - Show service status and access points"
        echo "  logs [service] - Show logs (all services or specific service)"
        echo "  clean          - Stop and remove all containers and data"
        echo "  rebuild [svc]  - Rebuild and restart a specific service"
        echo "  shell [service]- Open shell in a container"
        echo "  dev            - Run frontend locally in development mode"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 logs frontend"
        echo "  $0 rebuild gateway"
        echo "  $0 shell user-service"
        ;;
esac
