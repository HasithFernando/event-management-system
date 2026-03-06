package com.eventflow.ticketservice.controller;

import com.eventflow.ticketservice.dto.TicketPurchaseRequest;
import com.eventflow.ticketservice.dto.TicketResponse;
import com.eventflow.ticketservice.dto.TicketStatusUpdateRequest;
import com.eventflow.ticketservice.model.Ticket;
import com.eventflow.ticketservice.service.TicketPdfService;
import com.eventflow.ticketservice.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Tickets", description = "Ticket purchasing, management, and PDF download")
public class TicketController {
  private final TicketService ticketService;
  private final TicketPdfService ticketPdfService;

  public TicketController(TicketService ticketService, TicketPdfService ticketPdfService) {
    this.ticketService = ticketService;
    this.ticketPdfService = ticketPdfService;
  }

  @PostMapping
  @Operation(summary = "Purchase tickets", description = "Purchase one or more tickets for an event")
  public ResponseEntity<List<TicketResponse>> purchase(@Valid @RequestBody TicketPurchaseRequest request) {
    List<Ticket> tickets = ticketService.purchase(request);
    return ResponseEntity.ok(tickets.stream().map(this::toResponse).toList());
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get ticket by ID", description = "Retrieve a single ticket by its UUID")
  public TicketResponse get(
      @Parameter(description = "UUID of the ticket", required = true) @PathVariable UUID id) {
    return toResponse(ticketService.get(id));
  }

  @GetMapping
  @Operation(summary = "List tickets", description = "List tickets, optionally filtered by eventId or userId")
  public List<TicketResponse> list(
      @Parameter(description = "Filter by event UUID") @RequestParam(required = false) UUID eventId,
      @Parameter(description = "Filter by user UUID") @RequestParam(required = false) UUID userId) {
    return ticketService.list(eventId, userId).stream().map(this::toResponse).toList();
  }

  @GetMapping("/event/{eventId}")
  @Operation(summary = "Get tickets by event", description = "Retrieve all tickets for a specific event")
  public List<TicketResponse> getByEvent(
      @Parameter(description = "UUID of the event", required = true) @PathVariable UUID eventId) {
    return ticketService.getByEvent(eventId).stream().map(this::toResponse).toList();
  }

  @GetMapping("/user/{userId}")
  @Operation(summary = "Get tickets by user", description = "Retrieve all tickets for a specific user")
  public List<TicketResponse> getByUser(
      @Parameter(description = "UUID of the user", required = true) @PathVariable UUID userId) {
    return ticketService.getByUser(userId).stream().map(this::toResponse).toList();
  }

  @GetMapping("/count")
  @Operation(summary = "Count all tickets", description = "Get total number of tickets in the system")
  public ResponseEntity<Long> count() {
    return ResponseEntity.ok(ticketService.count());
  }

  @GetMapping("/event/{eventId}/count")
  @Operation(summary = "Count tickets for event", description = "Get number of tickets sold for a specific event")
  public ResponseEntity<Long> countByEvent(
      @Parameter(description = "UUID of the event", required = true) @PathVariable UUID eventId) {
    return ResponseEntity.ok(ticketService.countByEvent(eventId));
  }

  @PatchMapping("/{id}/status")
  @Operation(summary = "Update ticket status", description = "Update the status of a ticket (e.g. Confirmed, Used)")
  public ResponseEntity<TicketResponse> updateStatus(
      @Parameter(description = "UUID of the ticket", required = true) @PathVariable UUID id,
      @Valid @RequestBody TicketStatusUpdateRequest request) {
    return ResponseEntity.ok(toResponse(ticketService.updateStatus(id, request)));
  }

  @PatchMapping("/{id}/cancel")
  @Operation(summary = "Cancel a ticket", description = "Soft-cancel a ticket. Only the ticket owner can cancel.")
  public ResponseEntity<TicketResponse> cancel(
      @Parameter(description = "UUID of the ticket", required = true) @PathVariable UUID id,
      @Parameter(description = "UUID of the user requesting cancellation", required = true) @RequestParam UUID userId) {
    return ResponseEntity.ok(toResponse(ticketService.cancel(id, userId)));
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete a ticket", description = "Permanently delete a ticket from the system")
  public ResponseEntity<Void> delete(
      @Parameter(description = "UUID of the ticket", required = true) @PathVariable UUID id) {
    ticketService.delete(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * Downloads a PDF ticket with an embedded QR code for the given booking.
   * GET /api/tickets/{id}/download
   */
  @GetMapping("/{id}/download")
  @Operation(summary = "Download ticket PDF", description = "Download a PDF ticket with an embedded QR code")
  public ResponseEntity<byte[]> download(
      @Parameter(description = "UUID of the ticket", required = true) @PathVariable UUID id) {
    byte[] pdfBytes = ticketPdfService.generateTicketPdf(id);
    String filename = "ticket-" + id + ".pdf";
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
        .contentType(MediaType.APPLICATION_PDF)
        .contentLength(pdfBytes.length)
        .body(pdfBytes);
  }

  private TicketResponse toResponse(Ticket ticket) {
    return new TicketResponse(
      ticket.getId(),
      ticket.getEventId(),
      ticket.getUserId(),
      ticket.getPrice(),
      ticket.getStatus(),
      ticket.getPurchasedAt()
    );
  }
}
