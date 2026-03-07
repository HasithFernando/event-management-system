package com.eventflow.feedbackservice.repository;

import com.eventflow.feedbackservice.model.Feedback;
import com.eventflow.feedbackservice.model.FeedbackCategory;
import com.eventflow.feedbackservice.model.FeedbackStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    List<Feedback> findAllByOrderByCreatedAtDesc();

    List<Feedback> findByStatusOrderByCreatedAtDesc(FeedbackStatus status);

    List<Feedback> findByCategoryOrderByCreatedAtDesc(FeedbackCategory category);

    List<Feedback> findByStatusAndCategoryOrderByCreatedAtDesc(FeedbackStatus status, FeedbackCategory category);

    List<Feedback> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
