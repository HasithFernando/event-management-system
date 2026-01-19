# Event Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black.svg)](https://nextjs.org/)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

A production-ready microservices-based event management platform built with **Spring Boot** and **Next.js**.

> 🚀 **Status:** Boilerplate complete and ready for development!  
> 📚 **Complete Guide:** See [GUIDE.md](GUIDE.md) for detailed documentation

---

## 🎯 What's This?

A complete, production-ready boilerplate for building a scalable event management system using microservices architecture. Perfect for learning microservices or starting a new project.

---

## 🚀 Quick Start

### Using Docker (Easiest - 5 Minutes)

```bash
git clone https://github.com/HasithFernando/event-management-system.git
cd event-management-system
docker-compose up --build
```

**Then access:**
- 🌐 Frontend: http://localhost:3000
- 🔍 Eureka Dashboard: http://localhost:8761
- 🌉 API Gateway: http://localhost:8080

### Local Development

See [GUIDE.md](GUIDE.md) for step-by-step local setup instructions.

---

## 📋 Prerequisites

**For Docker (Recommended):**
- Docker Desktop

**For Local Development:**
- Java 17+
- Maven 3.6+
- Node.js 18+

---

## 🏗️ Architecture

```
Frontend (Next.js) → API Gateway → Microservices → Databases
                          ↓
                   Discovery Server
                   Config Server
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **Frontend** | 3000 | Next.js web application |
| **API Gateway** | 8080 | Single entry point |
| **Discovery Server** | 8761 | Service registry (Eureka) |
| **Config Server** | 8888 | Centralized configuration |
| **Event Service** | 8081 | Event management |
| **User Service** | 8082 | User management |
| **Booking Service** | 8083 | Booking management |

### Technology Stack

- **Backend:** Spring Boot 3.2.1, Java 17
- **Frontend:** Next.js 14, React 18, TypeScript 5.3
- **Service Discovery:** Netflix Eureka
- **API Gateway:** Spring Cloud Gateway
- **Databases:** MySQL 8.0 (H2 for development)
- **Containerization:** Docker & Docker Compose

---

## 📁 Project Structure

```
event-management-system/
├── backend/                # Business microservices
│   ├── event-service/      # Event management (Port 8081)
│   ├── user-service/       # User management (Port 8082)
│   └── booking-service/    # Booking management (Port 8083)
├── discovery/              # Eureka Server (Port 8761)
├── config-server/          # Config Server (Port 8888)
├── gateway/                # API Gateway (Port 8080)
├── frontend/               # Next.js App (Port 3000)
├── config-repo/            # Configuration files
├── docker-compose.yml      # Docker orchestration
├── README.md               # This file
└── GUIDE.md                # Complete documentation
```

---

## 🛠️ Development

### Quick Commands

**Backend (Maven):**
```bash
mvn spring-boot:run          # Run service
mvn clean package            # Build
mvn test                     # Run tests
```

**Frontend (NPM):**
```bash
npm install                  # Install dependencies
npm run dev                  # Development mode
npm run build                # Build for production
```

**Docker:**
```bash
docker-compose up            # Start all services
docker-compose down          # Stop all services
docker-compose logs -f       # View logs
docker-compose ps            # List running containers
```

### What's Implemented

✅ **Infrastructure (100%)**
- Complete microservices setup
- Service discovery and registration
- API Gateway with routing
- Docker configuration
- Database setup

🔨 **Ready to Build (0%)**
- Entity models and business logic
- REST API implementations
- Frontend pages and components
- Authentication and authorization
- Testing

---

## 📚 API Endpoints (To Implement)

### Event Service
```
GET    /api/events          # List events
GET    /api/events/{id}     # Get event
POST   /api/events          # Create event
PUT    /api/events/{id}     # Update event
DELETE /api/events/{id}     # Delete event
```

### User Service
```
GET    /api/users           # List users
GET    /api/users/{id}      # Get user
POST   /api/users           # Create user
PUT    /api/users/{id}      # Update user
DELETE /api/users/{id}      # Delete user
```

### Booking Service
```
GET    /api/bookings        # List bookings
GET    /api/bookings/{id}   # Get booking
POST   /api/bookings        # Create booking
PUT    /api/bookings/{id}   # Update booking
DELETE /api/bookings/{id}   # Delete booking
```

---

## 🔧 Configuration

### Frontend Environment

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080
```

### Backend Configuration

Each service has its own `application.yml` in `src/main/resources/`

---

## 🐛 Troubleshooting

### Services not showing in Eureka
- Wait 30-60 seconds for registration
- Ensure Discovery Server started first

### Port already in use
- Check and stop conflicting services
- Or change ports in `application.yml`

### Docker issues
```bash
docker-compose down -v       # Reset everything
docker system prune -f       # Clean up
```

For detailed troubleshooting, see [GUIDE.md](GUIDE.md).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Features

- ✨ Microservices Architecture
- 🔄 Service Discovery & Registration
- 🌉 API Gateway Pattern
- ⚙️ Centralized Configuration
- 🐳 Docker Ready
- 📱 Modern React Frontend
- 💾 Database Per Service
- 📊 Health Monitoring
- 📚 Comprehensive Documentation

---

## 👥 Built For Teams

This boilerplate is designed for team development with:
- Clear project structure
- Comprehensive documentation
- Easy local setup
- Docker support
- Git-ready configuration

---

**Ready to build something amazing!** 🚀

For questions, issues, or contributions, please open a GitHub issue.

**Version:** 0.1.0 | **Status:** Ready for Development | **License:** MIT
