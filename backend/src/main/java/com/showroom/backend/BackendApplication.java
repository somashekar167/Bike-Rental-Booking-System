package com.showroom.backend;

import com.showroom.backend.entity.Bike;
import com.showroom.backend.repository.BikeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(BikeRepository bikeRepository) {
        return args -> {
            if (bikeRepository.count() == 0) {
                Bike b1 = new Bike();
                b1.setName("Ninja ZX-10R");
                b1.setBrand("Kawasaki");
                b1.setPrice(1600000.0);
                b1.setMileage("15 kmpl");
                b1.setEngine("998cc");
                b1.setImageUrl("https://images.unsplash.com/photo-1609630875171-b13213702ffa?q=80&w=1000&auto=format&fit=crop");
                b1.setDescription("The Ninja ZX-10R has a clear purpose: performance.");
                
                Bike b2 = new Bike();
                b2.setName("Duke 390");
                b2.setBrand("KTM");
                b2.setPrice(310000.0);
                b2.setMileage("28 kmpl");
                b2.setEngine("373cc");
                b2.setImageUrl("https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop");
                b2.setDescription("The KTM 390 DUKE brings the values that have made motorcycling so amazing.");

                Bike b3 = new Bike();
                b3.setName("YZF R15 V4");
                b3.setBrand("Yamaha");
                b3.setPrice(185000.0);
                b3.setMileage("40 kmpl");
                b3.setEngine("155cc");
                b3.setImageUrl("https://images.unsplash.com/photo-1591637333184-19a8cd872513?q=80&w=1000&auto=format&fit=crop");
                b3.setDescription("Born from the legacy of the R-Series, supersport performance.");

                bikeRepository.save(b1);
                bikeRepository.save(b2);
                bikeRepository.save(b3);
                System.out.println("Sample Data Loaded!");
            }
        };
    }
}
