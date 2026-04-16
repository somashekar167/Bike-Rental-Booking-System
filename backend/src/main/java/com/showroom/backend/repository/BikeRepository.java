package com.showroom.backend.repository;

import com.showroom.backend.entity.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
    List<Bike> findByNameContainingIgnoreCase(String name);
    List<Bike> findByBrandContainingIgnoreCase(String brand);
}
