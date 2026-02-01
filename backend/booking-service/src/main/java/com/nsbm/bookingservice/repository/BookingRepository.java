package com.nsbm.bookingservice.repository;

import com.nsbm.bookingservice.model.Booking;
import com.nsbm.bookingservice.model.BookingStatus;
import com.nsbm.bookingservice.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReference(String bookingReference);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByEventId(Long eventId);

    List<Booking> findByUserIdAndBookingStatus(Long userId, BookingStatus bookingStatus);

    List<Booking> findByEventIdAndBookingStatus(Long eventId, BookingStatus bookingStatus);

    List<Booking> findByPaymentStatus(PaymentStatus paymentStatus);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.eventId = :eventId AND b.paymentStatus = :paymentStatus")
    BigDecimal calculateEventRevenue(@Param("eventId") Long eventId,
            @Param("paymentStatus") PaymentStatus paymentStatus);

    Long countByEventId(Long eventId);

    Long countByEventIdAndBookingStatus(Long eventId, BookingStatus bookingStatus);
}
