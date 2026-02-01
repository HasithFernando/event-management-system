package com.nsbm.eventservice.repository;

import com.nsbm.eventservice.model.Event;
import com.nsbm.eventservice.model.EventCategory;
import com.nsbm.eventservice.model.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(EventStatus status);

    List<Event> findByCategory(EventCategory category);

    List<Event> findByOrganizerId(Long organizerId);

    List<Event> findByEventDateAfterAndStatus(LocalDate date, EventStatus status);

    List<Event> findByEventDateBetweenAndStatus(LocalDate startDate, LocalDate endDate, EventStatus status);

    List<Event> findByFeaturedTrueAndStatus(EventStatus status);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND e.eventDate >= :date ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(@Param("status") EventStatus status, @Param("date") LocalDate date);

    @Query("SELECT e FROM Event e WHERE " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND e.status = :status")
    List<Event> searchEvents(@Param("query") String query, @Param("status") EventStatus status);

    @Query("SELECT e FROM Event e WHERE e.category = :category AND e.status = :status AND e.eventDate >= :date")
    List<Event> findByCategoryAndUpcoming(
            @Param("category") EventCategory category,
            @Param("status") EventStatus status,
            @Param("date") LocalDate date);

    Page<Event> findByStatusAndEventDateGreaterThanEqual(EventStatus status, LocalDate date, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.organizerId = :organizerId")
    Long countByOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT e FROM Event e WHERE e.availableSeats > 0 AND e.status = :status AND e.eventDate >= :date")
    List<Event> findAvailableEvents(@Param("status") EventStatus status, @Param("date") LocalDate date);
}
