package com.showroom.backend.controller;

import com.showroom.backend.entity.Bike;
import com.showroom.backend.repository.BikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bikes")
public class BikeController {

    @Autowired
    private BikeRepository bikeRepository;

    @GetMapping
    public List<Bike> getAllBikes() {
        return bikeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bike> getBikeById(@PathVariable("id") Long id) {
        return bikeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Bike createBike(@RequestBody Bike bike) {
        return bikeRepository.save(bike);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bike> updateBike(@PathVariable("id") Long id, @RequestBody Bike bikeDetails) {
        return bikeRepository.findById(id)
                .map(bike -> {
                    bike.setName(bikeDetails.getName());
                    bike.setBrand(bikeDetails.getBrand());
                    bike.setPrice(bikeDetails.getPrice());
                    bike.setMileage(bikeDetails.getMileage());
                    bike.setEngine(bikeDetails.getEngine());
                    bike.setImageUrl(bikeDetails.getImageUrl());
                    bike.setDescription(bikeDetails.getDescription());
                    Bike updatedBike = bikeRepository.save(bike);
                    return ResponseEntity.ok(updatedBike);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBike(@PathVariable("id") Long id) {
        return bikeRepository.findById(id)
                .map(bike -> {
                    bikeRepository.delete(bike);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
