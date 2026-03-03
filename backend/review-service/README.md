# Review Service

A microservice for managing event reviews and ratings in the EventFlow system.

---

## 📋 Overview

The Review Service enables attendees to provide feedback on events they have attended, helping organizers improve future events and giving potential attendees insights into event quality.

**Port:** `8089`  
**Service Name:** `review-service`

---

## 🎯 Planned Features

### Core Functionality
- ✅ **Review CRUD Operations**
  - Create reviews for attended events
  - Update existing reviews (by review author only)
  - Delete reviews (by review author or admin)
  - Retrieve reviews by event or user

- ✅ **Rating System**
  - Star ratings (1-5 scale)
  - Text-based feedback/comments
  - Optional pros/cons sections
  - Review helpfulness voting (thumbs up/down)

- ✅ **Verification & Validation**
  - Only verified attendees (with valid tickets) can review
  - One review per user per event
  - Mandatory attendance verification before submission
  - Review moderation flags for inappropriate content

### Analytics & Aggregation
- 📊 **Event Rating Metrics**
  - Average rating calculation per event
  - Total review count
  - Rating distribution (e.g., 5-star: 20, 4-star: 15, etc.)
  - Trending events based on recent positive reviews

- 📊 **Review Statistics**
  - Most helpful reviews
  - Recent reviews feed
  - Review response rate by organizers

### Integration Points
- 🎫 **Ticket Service**: Verify user attended the event before allowing review
- 🎪 **Event Service**: Fetch event details, update event with aggregated ratings
- 👤 **Auth Service**: User authentication and authorization
- 🔔 **Notification Service**: Notify organizers of new reviews

### Advanced Features (Future)
- 🤖 **Sentiment Analysis**: Automatically analyze review sentiment (positive/negative/neutral)
- 🏷️ **Tag System**: Categorize reviews with tags (e.g., "great-venue", "poor-audio")
- 💬 **Organizer Responses**: Allow organizers to respond to reviews
- 🚩 **Moderation System**: Flag and review inappropriate content
- 📸 **Photo Uploads**: Allow users to attach photos to reviews
- 🏆 **Verified Reviewer Badges**: Highlight users with many quality reviews
- 📧 **Review Reminders**: Send notifications to attendees to leave reviews post-event

---

## 🗂️ Planned Data Model

### Review Entity
```java
class Review {
  UUID id;
  UUID eventId;        // Reference to event
  UUID userId;         // Author of review
  int rating;          // 1-5 stars
  String title;        // Short review title
  String comment;      // Detailed feedback
  String pros;         // Optional: What was good
  String cons;         // Optional: What could be improved
  boolean verified;    // Ticket verification status
  int helpfulCount;    // Number of "helpful" votes
  ReviewStatus status; // PENDING, APPROVED, FLAGGED, REMOVED
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
}
```

### Review Status Enum
- `PENDING`: Awaiting moderation (if required)
- `APPROVED`: Visible to all users
- `FLAGGED`: Reported for review
- `REMOVED`: Removed by moderator

---

## 🔌 Planned API Endpoints

### Review Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Create a new review |
| GET | `/api/reviews/{id}` | Get review by ID |
| PUT | `/api/reviews/{id}` | Update review (author only) |
| DELETE | `/api/reviews/{id}` | Delete review (author/admin) |
| GET | `/api/reviews/event/{eventId}` | Get all reviews for an event |
| GET | `/api/reviews/user/{userId}` | Get all reviews by a user |

### Rating Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/event/{eventId}/rating` | Get average rating for event |
| GET | `/api/reviews/event/{eventId}/stats` | Get rating distribution stats |
| GET | `/api/reviews/event/{eventId}/summary` | Get aggregated review summary |

### Review Interactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews/{id}/helpful` | Mark review as helpful |
| POST | `/api/reviews/{id}/flag` | Flag review for moderation |
| GET | `/api/reviews/recent` | Get recent reviews (feed) |

### Verification
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/can-review/{eventId}` | Check if user can review event |
| POST | `/api/reviews/verify/{reviewId}` | Verify attendance for review |

---

## 🔧 Technology Stack

- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Database**: H2 (in-memory) - can be switched to PostgreSQL/MySQL
- **Service Discovery**: Eureka Client
- **API Documentation**: Springdoc OpenAPI (Swagger)
- **Inter-Service Communication**: OpenFeign
- **Validation**: Jakarta Bean Validation

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- Eureka Server running on port 8761

### Running Locally
```bash
cd backend/review-service
mvn clean install
mvn spring-boot:run
```

The service will start on **http://localhost:8089**

### Docker
```bash
docker build -t review-service .
docker run -p 8089:8089 review-service
```

### API Documentation
Once running, access Swagger UI at:
- **http://localhost:8089/swagger-ui.html**

---

## 📝 Development Roadmap

### Phase 1: MVP (Minimum Viable Product)
- [ ] Implement Review entity and repository
- [ ] Create basic CRUD endpoints
- [ ] Integrate with Ticket Service for verification
- [ ] Implement rating aggregation
- [ ] Add validation rules

### Phase 2: Enhanced Features
- [ ] Add review helpfulness voting
- [ ] Implement flagging/moderation system
- [ ] Add pagination and sorting
- [ ] Create review statistics endpoints
- [ ] Add organizer response functionality

### Phase 3: Advanced Features
- [ ] Sentiment analysis integration
- [ ] Photo upload support
- [ ] Review reminder notifications
- [ ] Verified reviewer badges
- [ ] Advanced search and filtering

---

## 🔗 Service Dependencies

- **Eureka Server** (8761): Service registration and discovery
- **API Gateway** (8080): Request routing and JWT authentication
- **Event Service** (8081): Event information
- **Ticket Service** (8084): Attendance verification
- **Auth Service** (8082): User authentication
- **Notification Service** (8085): Review notifications

---

## 📊 Database Schema (Planned)

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    comment TEXT,
    pros TEXT,
    cons TEXT,
    verified BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'APPROVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)  -- One review per user per event
);

CREATE INDEX idx_reviews_event ON reviews(event_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Ensure code follows existing patterns in the project
2. Add unit tests for new features
3. Update this README with any new endpoints or features
4. Use conventional commit messages

---

## 📄 License

This service is part of the EventFlow system and follows the same MIT license.

---

## 📧 Contact

For questions or suggestions about this service, please open an issue in the main repository.
