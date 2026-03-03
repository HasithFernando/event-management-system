package com.eventflow.reviewservice.repository;

import com.eventflow.reviewservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Review Repository - Placeholder for future implementation
 * 
 * Will contain methods for:
 * - Finding reviews by event
 * - Finding reviews by user
 * - Calculating average ratings
 * - Finding top-rated events
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
  
  // TODO: Add custom query methods
  // List<Review> findByEventId(UUID eventId);
  // List<Review> findByUserId(UUID userId);
  // Optional<Review> findByEventIdAndUserId(UUID eventId, UUID userId);
  // List<Review> findByEventIdOrderByCreatedAtDesc(UUID eventId);
  // @Query("SELECT AVG(r.rating) FROM Review r WHERE r.eventId = :eventId")
  // Double getAverageRatingByEventId(@Param("eventId") UUID eventId);
}
