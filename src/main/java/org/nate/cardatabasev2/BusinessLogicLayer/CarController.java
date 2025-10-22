package org.nate.cardatabasev2.BusinessLogicLayer;

import org.nate.cardatabasev2.BusinessLogicLayer.CarService;
import org.nate.cardatabasev2.PresentationLayer.dto.car.CarRequest;
import org.nate.cardatabasev2.PresentationLayer.dto.car.CarResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;
@RestController
@RequestMapping("/cars")
@Validated
public class CarController {
    private final CarService carService;
    public CarController(CarService service) {
        this.carService = service;
    }
    @GetMapping
    public ResponseEntity<List<CarResponse>> getAllCars() {
        List<CarResponse> responseBody = carService.getAll();
        if (responseBody.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(responseBody);
    }
    @GetMapping("/{id}")
    public ResponseEntity<CarResponse> getCarById(@PathVariable Long id) {
        CarResponse responseBody = carService.getById(id);
        return ResponseEntity.ok(responseBody);
    }
    @PostMapping
    public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CarRequest requestBody) {
        CarResponse responseBody = carService.create(requestBody);
        return ResponseEntity.created(URI.create("/cars/" + responseBody.id()))
                .body(responseBody);
    }
    @PutMapping("/{id}")
    public ResponseEntity<CarResponse> updateCar(@PathVariable Long id,
                                                 @Valid @RequestBody CarRequest requestBody) {
        CarResponse responseBody = carService.update(id, requestBody);
        return ResponseEntity.ok(responseBody);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCar(@PathVariable Long id) {
        carService.delete(id);
        return ResponseEntity.ok("Car " + id + " deleted.");
    }
    @GetMapping("/search")
    public ResponseEntity<List<CarResponse>> searchCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Long ownerId,
    @RequestParam(required = false) String color,
    @RequestParam(required = false) Integer minPrice,
    @RequestParam(required = false) Integer maxPrice,
    @RequestParam(required = false) Integer minYear,
    @RequestParam(required = false) Integer maxYear,
    @RequestParam(required = false) String registrationContains
 ) {
        List<CarResponse> responseBody = carService.search(brand, ownerId, color, minPrice, maxPrice, minYear, maxYear,
                registrationContains);
        if (responseBody.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(responseBody);
    }
} 