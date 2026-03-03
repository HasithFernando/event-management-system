package com.eventflow.reviewservice.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Review Entity - Placeholder for future implementation
 * 
 * Represents a review and rating for an event by a user.
 */
@Entity
@Table(name = "reviews",
    uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "user_id"}))
public class Review {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "event_id", nullable = false)
  private UUID eventId;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(nullable = false)
  private Integer rating; // 1-5 stars

  @Column(length = 200)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String comment;

  @Column(columnDefinition = "TEXT")
  private String pros;

  @Column(columnDefinition = "TEXT")
  private String cons;

  @Column(nullable = false)
  private Boolean verified = false;

  @Column(name = "helpful_count")
  private Integer helpfulCount = 0;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private ReviewStatus status = ReviewStatus.APPROVED;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  // Constructors
  public Review() {
  }

  public Review(UUID eventId, UUID userId, Integer rating, String title, String comment) {
    this.eventId = eventId;
    this.userId = userId;
    this.rating = rating;
    this.title = title;
    this.comment = comment;
  }

  // Getters and Setters
  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UUID getEventId() {
    return eventId;
  }

  public void setEventId(UUID eventId) {
    this.eventId = eventId;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public Integer getRating() {
    return rating;
  }

  public void setRating(Integer rating) {
    this.rating = rating;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public String getPros() {
    return pros;
  }

  public void setPros(String pros) {
    this.pros = pros;
  }

  public String getCons() {
    return cons;
  }

  public void setCons(String cons) {
    this.cons = cons;
  }

  public Boolean getVerified() {
    return verified;
  }

  public void setVerified(Boolean verified) {
    this.verified = verified;
  }

  public Integer getHelpfulCount() {
    return helpfulCount;
  }

  public void setHelpfulCount(Integer helpfulCount) {
    this.helpfulCount = helpfulCount;
  }

  public ReviewStatus getStatus() {
    return status;
  }

  public void setStatus(ReviewStatus status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
