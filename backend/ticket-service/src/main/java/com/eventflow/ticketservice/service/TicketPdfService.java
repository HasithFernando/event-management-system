package com.eventflow.ticketservice.service;

import com.eventflow.ticketservice.client.EventServiceClient;
import com.eventflow.ticketservice.model.Ticket;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;

/**
 * Generates a PDF ticket with an embedded QR code for a given booking.
 *
 * <p>Architecture note: This functionality lives inside the existing ticket-service
 * because the service already owns the ticket data and has a client for the event-service.
 * No new microservice is required.</p>
 */
@Service
public class TicketPdfService {

  private final TicketService ticketService;
  private final EventServiceClient eventServiceClient;

  // Brand color: indigo-600 (#4F46E5)
  private static final float[] COLOR_BRAND     = {79f / 255f, 70f / 255f, 229f / 255f};
  private static final float[] COLOR_BRAND_LIGHT = {238f / 255f, 242f / 255f, 255f / 255f};
  private static final float[] COLOR_TEXT_DARK = {17f / 255f, 24f / 255f, 39f / 255f};
  private static final float[] COLOR_TEXT_MUTED = {107f / 255f, 114f / 255f, 128f / 255f};
  private static final float[] COLOR_SUCCESS   = {21f / 255f, 128f / 255f, 61f / 255f};
  private static final float[] COLOR_WHITE     = {1f, 1f, 1f};
  private static final float[] COLOR_BORDER    = {226f / 255f, 232f / 255f, 240f / 255f};

  public TicketPdfService(TicketService ticketService, EventServiceClient eventServiceClient) {
    this.ticketService = ticketService;
    this.eventServiceClient = eventServiceClient;
  }

  /**
   * Generates a PDF ticket document for the given ticket ID.
   *
   * @param ticketId the UUID of the ticket
   * @return a byte array containing the PDF document
   */
  public byte[] generateTicketPdf(UUID ticketId) {
    Ticket ticket = ticketService.get(ticketId);

    // Fetch event details from event-service
    Map<String, Object> event = eventServiceClient.getEvent(ticket.getEventId());
    String eventTitle    = getValue(event, "title",    "Event");
    String eventDate     = getValue(event, "date",     "");
    String eventTime     = getValue(event, "time",     "");
    String eventLocation = getValue(event, "location", "");
    String eventCategory = getValue(event, "category", "");

    