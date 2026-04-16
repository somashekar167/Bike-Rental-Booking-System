package com.showroom.backend.dto;

import java.time.LocalDate;

public class BookingRequest {
    private String user_name;
    private String phone;
    private Long bike_id;
    private LocalDate booking_date;

    // Getters and Setters
    public String getUser_name() { return user_name; }
    public void setUser_name(String user_name) { this.user_name = user_name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Long getBike_id() { return bike_id; }
    public void setBike_id(Long bike_id) { this.bike_id = bike_id; }

    public LocalDate getBooking_date() { return booking_date; }
    public void setBooking_date(LocalDate booking_date) { this.booking_date = booking_date; }
}
