package com.eventflow.feedbackservice.service;

import com.eventflow.feedbackservice.dto.FeedbackCreateRequest;
import com.eventflow.feedbackservice.dto.FeedbackResponse;
import com.eventflow.feedbackservice.dto.FeedbackStatusUpdateRequest;
import com.eventflow.feedbackservice.exception.FeedbackNotFoundException;
import com.eventflow.feedbackservice.model.Feedback;
import com.eventflow.feedbackservice.model.FeedbackCategory;
import com.eventflow.feedbackservice.model.FeedbackStatus;
import com.eventflow.feedbackservice.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Transactional
    public FeedbackResponse createFeedback(FeedbackCreateRequest request) {
        Feedback feedback = new Feedback();
        feedback.setUserId(request.userId());
        feedback.setUserName(request.userName());
        feedback.setUserEmail(request.userEmail());
        feedback.setCategory(request.category());
        feedback.setSubject(request.subject());
        feedback.setMessage(request.message());
        feedback.setSatisfactionScore(request.satisfactionScore());
        feedback.setStatus(FeedbackStatus.OPEN);
        return toResponse(feedbackRepository.save(feedback));
    }

    public FeedbackResponse getFeedback(UUID id) {
        return toResponse(findById(id));
    }

    public List<FeedbackResponse> getAllFeedback(FeedbackStatus status, FeedbackCategory category) {
        List<Feedback> results;
        if (status != null && category != null) {
            results = feedbackRepository.findByStatusAndCategoryOrderByCreatedAtDesc(status, category);
        } else if (status != null) {
            results = feedbackRepository.findByStatusOrderByCreatedAtDesc(status);
        } else if (category != null) {
            results = feedbackRepository.findByCategoryOrderByCreatedAtDesc(category);
        } else {
            results = feedbackRepository.findAllByOrderByCreatedAtDesc();
        }
        return results.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<FeedbackResponse> getFeedbackByUser(UUID userId) {
        return feedbackRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackResponse updateStatus(UUID id, FeedbackStatusUpdateRequest request) {
        Feedback feedback = findById(id);
        feedback.setStatus(request.status());
        if (request.adminNotes() != null) {
            feedback.setAdminNotes(request.adminNotes());
        }
        return toResponse(feedbackRepository.save(feedback));
    }

    @Transactional
    public void deleteFeedback(UUID id) {
        Feedback feedback = findById(id);
        feedbackRepository.delete(feedback);
    }

    private Feedback findById(UUID id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new FeedbackNotFoundException("Feedback not found with id: " + id));
    }

    private FeedbackResponse toResponse(Feedback f) {
        return new FeedbackResponse(
                f.getId(),
                f.getUserId(),
                f.getUserName(),
                f.getUserEmail(),
                f.getCategory(),
                f.getSubject(),
                f.getMessage(),
                f.getSatisfactionScore(),
                f.getStatus(),
                f.getAdminNotes(),
                f.getCreatedAt(),
                f.getUpdatedAt()
        );
    }
}
