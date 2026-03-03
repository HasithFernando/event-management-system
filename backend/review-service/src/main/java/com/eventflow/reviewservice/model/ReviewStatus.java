package com.eventflow.reviewservice.model;

/**
 * Review Status Enum
 * 
 * Defines the lifecycle states of a review
 */
public enum ReviewStatus {
  /**
   * Review is awaiting moderation (if moderation is enabled)
   */
  PENDING,

  /**
   * Review has been approved and is visible to all users
   */
  APPROVED,

  /**
   * Review has been flagged for inappropriate content
   */
  FLAGGED,

  /**
   * Review has been removed by moderator or admin
   */
  REMOVED
}
