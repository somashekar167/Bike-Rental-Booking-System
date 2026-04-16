package com.showroom.backend.controller;

import com.showroom.backend.dto.BookingRequest;
import com.showroom.backend.entity.Bike;
import com.showroom.backend.entity.Booking;
import com.showroom.backend.repository.BikeRepository;
import com.showroom.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BikeRepository bikeRepository;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        Optional<Bike> bikeOptional = bikeRepository.findById(request.getBike_id());
        
        if (!bikeOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Bike not found with ID: " + request.getBike_id());
        }

        Booking booking = new Booking();
        booking.setUserName(request.getUser_name());
        booking.setPhone(request.getPhone());
        booking.setBookingDate(request.getBooking_date());
        booking.setBike(bikeOptional.get());

        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(savedBooking);
    }
}
