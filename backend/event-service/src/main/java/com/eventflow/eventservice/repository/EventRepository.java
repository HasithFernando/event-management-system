package com.eventflow.eventservice.repository;

import com.eventflow.eventservice.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
}

