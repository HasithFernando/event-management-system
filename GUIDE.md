# Event Management System - Complete Guide

## Quick Start

### Prerequisites
- Docker and Docker Compose (easiest option)
- **OR** Java 17+, Maven 3.6+, Node.js 18+ (for local development)

### 5-Minute Setup (Docker)

```bash
# Clone and start
git clone https://github.com/HasithFernando/event-management-system.git
cd event-management-system
docker-compose up --build
```

**Access Services:**
- Frontend: http://localhost:3000
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080

### Local Development Setup

**1. Start Infrastructure Services:**
```bash
# Terminal 1 - Discovery Server
cd discovery && mvn spring-boot:run

# Terminal 2 - Config Server (wait 30s after Discovery)
cd config-server && mvn spring-boot:run

# Terminal 3 - API Gateway (wait 30s after Config)
cd gateway && mvn spring-boot:run
```

**2. Start Microservices:**
```bash
# Terminal 4 - Event Service
cd backend/event-service && mvn spring-boot:run

# Terminal 5 - User Service
cd backend/user-service && mvn spring-boot:run

# Terminal 6 - Booking Service
cd backend/booking-service && mvn spring-boot:run
```

**3. Start Frontend:**
```bash
# Terminal 7
cd frontend
npm install
npm run dev
```

---

## Architecture

### System Overview

```
Client Browser → Frontend (Next.js) → API Gateway → Microservices → Databases
                                           ↓
                                    Discovery Server
                                    Config Server
```

### Services

**Infrastructure Layer:**
- **Discovery Server** (8761) - Netflix Eureka service registry
- **Config Server** (8888) - Centralized configuration
- **API Gateway** (8080) - Routing, load balancing

**Business Layer:**
- **Event Service** (8081) - Event management
- **User Service** (8082) - User management
- **Booking Service** (8083) - Booking management

**Presentation Layer:**
- **Frontend** (3000) - Next.js web application

**Data Layer:**
- MySQL databases (separate per service)

### Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend | Spring Boot 3.2.1, Java 17 |
| Frontend | Next.js 14, React 18, TypeScript 5.3 |
| Service Discovery | Netflix Eureka |
| API Gateway | Spring Cloud Gateway |
| Databases | MySQL 8.0 (H2 for development) |
| Containerization | Docker & Docker Compose |

---

## Project Structure

```
event-management-system/
├── backend/                    # Business microservices
│   ├── event-service/         # Event management
│   ├── user-service/          # User management
│   └── booking-service/       # Booking management
├── config-repo/               # Configuration files
├── config-server/             # Config Server
├── discovery/                 # Eureka Server
├── gateway/                   # API Gateway
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/              # Pages & layouts
│   │   ├── lib/              # Utilities
│   │   └── services/         # API services
│   └── package.json
├── docker-compose.yml         # Orchestration
├── build.sh / build.bat       # Build scripts
└── README.md & GUIDE.md       # Documentation
```

### Port Allocation

| Service | Port | Type |
|---------|------|------|
| Frontend | 3000 | HTTP |
| API Gateway | 8080 | HTTP |
| Event Service | 8081 | HTTP |
| User Service | 8082 | HTTP |
| Booking Service | 8083 | HTTP |
| Discovery Server | 8761 | HTTP |
| Config Server | 8888 | HTTP |
| Event DB | 3307 | MySQL |
| User DB | 3308 | MySQL |
| Booking DB | 3309 | MySQL |

---

## Setup Instructions

### Initial Setup Checklist

- [ ] Install Java 17+
- [ ] Install Maven 3.6+
- [ ] Install Node.js 18+
- [ ] Install Docker & Docker Compose
- [ ] Clone the repository
- [ ] Copy `.env.local.example` to `.env.local` in frontend directory

### Environment Configuration

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080
```

**Backend (application.yml):**
Each service has its own configuration in `src/main/resources/application.yml`

### Verification Steps

1. **Check Eureka Dashboard** - http://localhost:8761
   - Should show all 6 services registered

2. **Test Frontend** - http://localhost:3000
   - Should display home page

3. **Test Health Endpoints:**
   ```bash
   curl http://localhost:8081/events/health
   curl http://localhost:8082/users/health
   curl http://localhost:8083/bookings/health
   ```

### Common Issues

**Services not registering:**
- Wait 30-60 seconds for registration
- Ensure Discovery Server started first

**Port conflicts:**
- Check if ports 3000, 8080-8083, 8761, 8888 are available
- Stop conflicting services

**Database issues:**
- For Docker: `docker-compose down -v` to reset
- Local: Services use H2 in-memory database

---

## Development Guide

### Project Status

**Completed (100%):**
- ✅ Infrastructure setup
- ✅ Service structure
- ✅ Docker configuration
- ✅ API Gateway routing
- ✅ Database configuration

**To Implement (0%):**
- 🔨 Entity models
- 🔨 Repository implementations
- 🔨 Business logic
- 🔨 REST endpoints
- 🔨 Frontend pages
- 🔨 Authentication

### Adding New Microservices

The architecture supports easy addition of new microservices. Here's how to add one:

#### Suggested Additional Services 

1. **Payment Service** (8084) - Process payments and transactions
2. **Notification Service** (8085) - Email/SMS notifications
3. **Review Service** (8086) - Event reviews and ratings
4. **Category Service** (8087) - Event categories and tags
5. **Search Service** (8088) - Advanced search functionality
6. **Analytics Service** (8089) - Analytics and reporting
7. **Media Service** (8090) - File/image uploads
8. **Venue Service** (8091) - Venue management
9. **Ticket Service** (8092) - Ticket generation and validation
10. **Promotion Service** (8093) - Discounts and promotions

#### Step-by-Step: Adding a New Service

1. Create a new Spring Boot project in backend/ directory
2. Add Eureka Client dependency
3. Configure application.yml with unique port and service name
4. Register with Discovery Server
5. Add routing rules in API Gateway
6. Update docker-compose.yml with new service
7. Add database if needed

#### Service Naming Convention

- **Service Name:** `service-name-service` (e.g., `payment-service`)
- **Port:** Sequential starting from 8084
- **Database:** `service-name-db` on port 330X
- **Package:** `com.nsbm.servicenameservice`

#### Common Patterns for Services

**1. CRUD Service Pattern:**
- Controller → Service → Repository → Database
- Use for: Event, User, Booking, Category, Venue services

**2. Processing Service Pattern:**
- Controller → Service → External API/Logic
- Use for: Payment, Notification, Search services

**3. Aggregator Service Pattern:**
- Combines data from multiple services
- Use for: Analytics, Reporting services

**4. Utility Service Pattern:**
- Provides shared functionality
- Use for: Media, File Storage services

### API Endpoints (To Implement)

**Event Service:**
```
GET    /api/events          # List all events
GET    /api/events/{id}     # Get event
POST   /api/events          # Create event
PUT    /api/events/{id}     # Update event
DELETE /api/events/{id}     # Delete event
```

**User Service:**
```
GET    /api/users           # List all users
GET    /api/users/{id}      # Get user
POST   /api/users           # Create user
PUT    /api/users/{id}      # Update user
DELETE /api/users/{id}      # Delete user
```

**Booking Service:**
```
GET    /api/bookings        # List all bookings
GET    /api/bookings/{id}   # Get booking
POST   /api/bookings        # Create booking
PUT    /api/bookings/{id}   # Update booking
DELETE /api/bookings/{id}   # Delete booking
```

### Building Services

**Backend:**
```bash
# Build a service
cd <service-directory>
mvn clean package

# Run tests
mvn test

# Run service
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Development mode
npm run build        # Production build
npm test             # Run tests
```

### Docker Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Build and start
docker-compose up --build

# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f <service-name>
```

---

## Contributing

### Getting Started

1. Clone the repository
2. Create your branch
3. Make changes and commit
4. Push and create pull request

### Code Standards

**Backend (Java/Spring Boot):**
- Follow Java naming conventions
- Add JavaDoc for public methods
- Write unit tests
- Ensure `mvn clean verify` passes

**Frontend (TypeScript/Next.js):**
- Follow TypeScript best practices
- Use functional components
- Add type definitions
- Ensure `npm run lint` passes

---

## Troubleshooting

### Service Discovery Issues
**Problem:** Services not appearing in Eureka  
**Solution:** 
- Wait 30-60 seconds for registration
- Check `eureka.client.serviceUrl.defaultZone` configuration
- Ensure Discovery Server is running

### Database Connection Errors
**Problem:** Can't connect to database  
**Solution:**
- Verify MySQL containers: `docker-compose ps`
- Check credentials in application.yml
- For Docker: `docker-compose down -v` and restart

### Frontend API Errors
**Problem:** Can't reach backend  
**Solution:**
- Verify API Gateway is running on port 8080
- Check `NEXT_PUBLIC_API_GATEWAY_URL` in .env.local
- Ensure CORS is configured in Gateway

### Port Already in Use
**Problem:** Port conflict on startup  
**Solution:**
- Check what's using the port
- Stop conflicting process
- Or change port in application.yml

---

## Useful Commands

### Maven
```bash
mvn clean install              # Build and install
mvn clean package             # Build JAR
mvn spring-boot:run           # Run application
mvn test                      # Run tests
mvn clean package -DskipTests # Build without tests
```

### NPM
```bash
npm install                   # Install dependencies
npm run dev                   # Development server
npm run build                 # Production build
npm start                     # Run production build
npm test                      # Run tests
npm run lint                  # Lint code
```

### Docker
```bash
docker ps                     # List containers
docker logs <container>       # View logs
docker exec -it <container> sh # Access container
docker system prune -f        # Clean up
```

---

## Support

- **Documentation:** Check README.md and this guide
- **Issues:** Open GitHub issues
- **Questions:** Use GitHub Discussions
- **License:** MIT (see LICENSE file)

---

**Version:** 0.1.0  
**Last Updated:** January 2026  
**Status:** Ready for Development

This boilerplate provides everything needed to start building a production-grade event management system. Happy coding! 🚀
