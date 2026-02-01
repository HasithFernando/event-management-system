package com.nsbm.bookingservice.service;

import com.nsbm.bookingservice.client.EventServiceClient;
import com.nsbm.bookingservice.client.UserServiceClient;
import com.nsbm.bookingservice.dto.*;
import com.nsbm.bookingservice.exception.BookingException;
import com.nsbm.bookingservice.exception.ResourceNotFoundException;
import com.nsbm.bookingservice.model.Booking;
import com.nsbm.bookingservice.model.BookingStatus;
import com.nsbm.bookingservice.model.PaymentStatus;
import com.nsbm.bookingservice.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventServiceClient eventServiceClient;
    private final UserServiceClient userServiceClient;

    public BookingDTO createBooking(CreateBookingRequest request) {
        // Validate user exists
        ResponseEntity<Boolean> userExistsResponse = userServiceClient.userExists(request.getUserId());
        if (!Boolean.TRUE.equals(userExistsResponse.getBody())) {
            throw new BookingException("User not found with ID: " + request.getUserId());
        }

        // Validate event exists and has available seats
        ResponseEntity<EventDTO> eventResponse = eventServiceClient.getEventById(request.getEventId());
        if (!eventResponse.hasBody() || eventResponse.getBody() == null) {
            throw new BookingException("Event not found with ID: " + request.getEventId());
        }

        EventDTO event = eventResponse.getBody();

        // Check seat availability
        ResponseEntity<Boolean> availabilityResponse = eventServiceClient.hasAvailableSeats(
                request.getEventId(), request.getNumberOfTickets());
        if (!Boolean.TRUE.equals(availabilityResponse.getBody())) {
            throw new BookingException("Not enough seats available for event: " + event.getTitle());
        }

        // Get user details
        ResponseEntity<UserDTO> userResponse = userServiceClient.getUserById(request.getUserId());
        UserDTO user = userResponse.getBody();

        // Calculate total amount
        BigDecimal totalAmount = event.getPrice().multiply(new BigDecimal(request.getNumberOfTickets()));

        // Reserve seats in event service
        try {
            eventServiceClient.reserveSeats(request.getEventId(), request.getNumberOfTickets());
        } catch (Exception e) {
            throw new BookingException("Failed to reserve seats: " + e.getMessage());
        }

        // Create booking
        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .eventId(request.getEventId())
                .numberOfTickets(request.getNumberOfTickets())
                .totalAmount(totalAmount)
                .bookingStatus(BookingStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .eventTitle(event.getTitle())
                .eventLocation(event.getLocation())
                .eventDateTime(LocalDateTime.of(event.getEventDate(), event.getStartTime()))
                .userEmail(user != null ? user.getEmail() : null)
                .userName(user != null ? user.getFullName() : null)
                .build();

        booking = bookingRepository.save(booking);
        log.info("Booking created successfully: {}", booking.getBookingReference());

        return toDTO(booking);
    }

    @Transactional(readOnly = true)
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        return toDTO(booking);
    }

    @Transactional(readOnly = true)
    public BookingDTO getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "reference", reference));
        return toDTO(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsByEvent(Long eventId) {
        return bookingRepository.findByEventId(eventId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO confirmPayment(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.confirm();
        booking = bookingRepository.save(booking);

        log.info("Payment confirmed for booking: {}", booking.getBookingReference());
        return toDTO(booking);
    }

    public BookingDTO cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (!booking.canBeCancelled()) {
            throw new BookingException("Booking cannot be cancelled in current state");
        }

        // Release seats back to event
        try {
            eventServiceClient.releaseSeats(booking.getEventId(), booking.getNumberOfTickets());
        } catch (Exception e) {
            log.error("Failed to release seats for cancelled booking {}: {}",
                    booking.getBookingReference(), e.getMessage());
        }

        booking.cancel();
        booking = bookingRepository.save(booking);

        log.info("Booking cancelled: {}", booking.getBookingReference());
        return toDTO(booking);
    }

    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        // If booking is confirmed, release seats
        if (booking.getBookingStatus() == BookingStatus.CONFIRMED ||
                booking.getBookingStatus() == BookingStatus.PENDING) {
            try {
                eventServiceClient.releaseSeats(booking.getEventId(), booking.getNumberOfTickets());
            } catch (Exception e) {
                log.error("Failed to release seats when deleting booking {}: {}",
                        booking.getBookingReference(), e.getMessage());
            }
        }

        bookingRepository.deleteById(id);
        log.info("Booking deleted: {}", booking.getBookingReference());
    }

    @Transactional(readOnly = true)
    public BigDecimal getEventRevenue(Long eventId) {
        BigDecimal revenue = bookingRepository.calculateEventRevenue(eventId, PaymentStatus.PAID);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public Long getEventBookingsCount(Long eventId) {
        return bookingRepository.countByEventId(eventId);
    }

    private BookingDTO toDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .eventId(booking.getEventId())
                .numberOfTickets(booking.getNumberOfTickets())
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getBookingStatus())
                .paymentStatus(booking.getPaymentStatus())
                .bookingReference(booking.getBookingReference())
                .eventTitle(booking.getEventTitle())
                .eventLocation(booking.getEventLocation())
                .eventDateTime(booking.getEventDateTime())
                .userEmail(booking.getUserEmail())
                .userName(booking.getUserName())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
