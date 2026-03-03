package com.eventflow.ticketservice.repository;

import com.eventflow.ticketservice.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
  List<Ticket> findByEventId(UUID eventId);
  List<Ticket> findByUserId(UUID userId);
  List<Ticket> findByEventIdAndUserId(UUID eventId, UUID userId);
}

