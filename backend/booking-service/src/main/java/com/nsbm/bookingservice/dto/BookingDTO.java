package com.nsbm.bookingservice.dto;

import com.nsbm.bookingservice.model.BookingStatus;
import com.nsbm.bookingservice.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private Long userId;
    private Long eventId;
    private Integer numberOfTickets;
    private BigDecimal totalAmount;
    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;
    private String bookingReference;
    private String eventTitle;
    private String eventLocation;
    private LocalDateTime eventDateTime;
    private String userEmail;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
