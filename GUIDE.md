# Event Management System - Complete Guide

> 🚧 **Important:** This is a development version with critical security vulnerabilities. **DO NOT use in production** without implementing security measures. See Security Section below.

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

> ⚠️ **Note:** All API endpoints are currently publicly accessible without authentication.

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

**✅ Completed:**
- Infrastructure setup (100%)
- Service structure (100%)
- Docker configuration (100%)
- API Gateway routing (100%)
- Database configuration (100%)
- Entity models and DTOs (100%)
- Repository implementations (100%)
- Business logic services (95%)
- REST endpoints (90%)
- Frontend pages and UI (95%)
- Inter-service communication (90%)

**❌ Critical Missing (Security):**
- Password hashing/encryption (0%)
- JWT authentication (0%)
- Authorization controls (0%)
- CSRF protection (0%)
- Rate limiting (0%)
- Security headers (0%)

**🔨 To Enhance:**
- Comprehensive testing
- Email notifications
- Payment integration
- Advanced analytics
- Admin dashboard

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

### API Endpoints (Implemented)

All endpoints are currently **publicly accessible** - authentication is not implemented.

**User Service (`/api/users`):**
```
POST   /api/users/auth/register           # Register new user
POST   /api/users/auth/login              # User login (no JWT returned)
GET    /api/users                         # List all users
GET    /api/users/{id}                    # Get user by ID
GET    /api/users/email/{email}           # Get user by email
PUT    /api/users/{id}                    # Update user
DELETE /api/users/{id}                    # Delete user (unprotected!)
PUT    /api/users/{id}/role               # Update role (unprotected!)
PUT    /api/users/{id}/disable            # Disable user (unprotected!)
PUT    /api/users/{id}/enable             # Enable user (unprotected!)
GET    /api/users/search?query=           # Search users
GET    /api/users/role/{role}             # Get users by role
```

**Event Service (`/api/events`):**
```
POST   /api/events                        # Create event
GET    /api/events                        # List all events
GET    /api/events/{id}                   # Get event by ID
PUT    /api/events/{id}                   # Update event
DELETE /api/events/{id}                   # Delete event (unprotected!)
GET    /api/events/published              # Get published events
GET    /api/events/upcoming               # Get upcoming events
GET    /api/events/featured               # Get featured events
GET    /api/events/category/{category}    # Get by category
GET    /api/events/organizer/{id}         # Get by organizer
GET    /api/events/search?query=          # Search events
PUT    /api/events/{id}/publish           # Publish event
PUT    /api/events/{id}/cancel            # Cancel event
POST   /api/events/{id}/reserve-seats     # Reserve seats
POST   /api/events/{id}/release-seats     # Release seats
```

**Booking Service (`/api/bookings`):**
```
POST   /api/bookings                      # Create booking
GET    /api/bookings                      # List all bookings
GET    /api/bookings/{id}                 # Get booking by ID
GET    /api/bookings/reference/{ref}      # Get by reference
DELETE /api/bookings/{id}                 # Delete booking (unprotected!)
GET    /api/bookings/user/{userId}        # Get user's bookings
GET    /api/bookings/event/{eventId}      # Get event's bookings
PUT    /api/bookings/{id}/confirm-payment # Confirm payment
PUT    /api/bookings/{id}/cancel          # Cancel booking
GET    /api/bookings/event/{id}/revenue   # Get event revenue
GET    /api/bookings/event/{id}/count     # Get booking count
```

> ⚠️ **Security Warning:** All endpoints are publicly accessible. Anyone can delete events, users, or bookings.

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

## Security Requirements

### 🔴 Critical Security Issues

Before using this application in any production or public-facing environment, you **MUST** implement:

1. **Password Hashing**
   ```java
   // Add BCryptPasswordEncoder to UserService
   private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
   
   // In register method:
   .password(passwordEncoder.encode(request.getPassword()))
   
   // In login method:
   if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
       throw new IllegalStateException("Invalid credentials");
   }
   ```

2. **JWT Authentication**
   - Implement JWT token generation on login
   - Add JWT validation filter
   - Configure Spring Security
   - Protect all endpoints with `@PreAuthorize`

3. **Authorization**
   ```java
   @PreAuthorize("hasRole('ADMIN')")
   @DeleteMapping("/{id}")
   public ResponseEntity<Void> deleteUser(@PathVariable Long id)
   
   @PreAuthorize("isAuthenticated()")
   @GetMapping
   public ResponseEntity<List<UserDTO>> getAllUsers()
   ```

4. **Environment Secrets**
   - Move all passwords to environment variables
   - Use `.env` files (gitignored)
   - Implement secrets management (Vault, AWS Secrets Manager)

5. **Security Configuration**
   ```java
   @Configuration
   @EnableWebSecurity
   @EnableMethodSecurity
   public class SecurityConfig {
       // Configure HTTP security
       // Add CSRF protection
       // Configure CORS properly
   }
   ```

6. **Update Dependencies**
   ```bash
   cd frontend
   npm audit fix
   npm install next@latest eslint@latest
   ```

### Additional Security Measures

- Add rate limiting on login endpoints
- Implement input validation and sanitization
- Add security headers (HSTS, CSP, etc.)
- Enable HTTPS in production
- Implement request/response logging
- Add intrusion detection
- Regular security audits

---

## Testing Guide

### Testing the API (Development Only)

**Using curl:**

```bash
# Register a user
curl -X POST http://localhost:8080/api/users/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123","phone":"1234567890"}'

# Login
curl -X POST http://localhost:8080/api/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Create event
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Tech Conference","description":"Annual tech event","location":"Convention Center","startDateTime":"2026-03-15T09:00:00","endDateTime":"2026-03-15T17:00:00","category":"CONFERENCE","capacity":500,"price":50.00,"organizerId":1}'

# List events
curl http://localhost:8080/api/events
```

**Using Postman:**

1. Import the API endpoints
2. Set base URL: `http://localhost:8080`
3. Create requests for each endpoint
4. Test different scenarios

### Running Tests

```bash
# Backend tests
cd backend/user-service
mvn test

# Frontend tests  
cd frontend
npm test
```

---

## Deployment Considerations

### Pre-Deployment Checklist

- [ ] Implement all security measures listed above
- [ ] Update all dependencies to latest stable versions
- [ ] Run security audit: `npm audit`, `mvn dependency:check`
- [ ] Configure production database (not H2)
- [ ] Set up proper environment variables
- [ ] Enable HTTPS/TLS
- [ ] Configure proper CORS origins
- [ ] Set up logging and monitoring
- [ ] Implement backup strategy
- [ ] Load testing
- [ ] Security penetration testing

### Environment Variables Required

```env
# Database
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# JWT
JWT_SECRET=
JWT_EXPIRATION=

# Application
APP_ENV=production
CORS_ALLOWED_ORIGINS=

# External Services
EMAIL_SERVICE_API_KEY=
PAYMENT_SERVICE_API_KEY=
```

---

**Version:** 0.2.0-dev  
**Last Updated:** February 2026  
**Status:** Development - NOT Production Ready

⚠️ **Important:** This application has critical security vulnerabilities. It is suitable for:
- Learning microservices architecture
- Development and testing
- As a starter template (with security implementation)

**NOT suitable for:**
- Production deployment (without security fixes)
- Public-facing applications
- Handling real user data

Implement all security measures before any production use. Happy (and secure) coding! 🔒🚀
