package com.nsbm.bookingservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User ID is required")
    @Column(nullable = false)
    private Long userId;

    @NotNull(message = "Event ID is required")
    @Column(nullable = false)
    private Long eventId;

    @NotNull(message = "Number of tickets is required")
    @Min(value = 1, message = "At least 1 ticket is required")
    @Column(nullable = false)
    private Integer numberOfTickets;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", message = "Total amount cannot be negative")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(nullable = false, unique = true)
    private String bookingReference;

    // Denormalized event info for quick access
    private String eventTitle;
    private String eventLocation;
    private LocalDateTime eventDateTime;

    // Denormalized user info
    private String userEmail;
    private String userName;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (bookingReference == null) {
            bookingReference = generateBookingReference();
        }
    }

    private String generateBookingReference() {
        return "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public boolean canBeCancelled() {
        return bookingStatus == BookingStatus.PENDING || bookingStatus == BookingStatus.CONFIRMED;
    }

    public void confirm() {
        if (paymentStatus != PaymentStatus.PAID) {
            throw new IllegalStateException("Cannot confirm booking without payment");
        }
        this.bookingStatus = BookingStatus.CONFIRMED;
    }

    public void cancel() {
        if (!canBeCancelled()) {
            throw new IllegalStateException("Booking cannot be cancelled in current state");
        }
        this.bookingStatus = BookingStatus.CANCELLED;
    }
}
