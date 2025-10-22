package org.nate.cardatabasev2.BusinessLogicLayer;

import org.nate.cardatabasev2.BusinessLogicLayer.CarService;
import org.nate.cardatabasev2.BusinessLogicLayer.OwnerService;
import org.nate.cardatabasev2.PresentationLayer.dto.car.CarResponse;
import org.nate.cardatabasev2.PresentationLayer.dto.owner.OwnerRequest;
import org.nate.cardatabasev2.PresentationLayer.dto.owner.OwnerResponse;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/owners")
@Validated
public class OwnerController {
    private final OwnerService ownerService;
    private final CarService carService;
    public OwnerController(OwnerService ownerService, CarService carService) {
        this.ownerService = ownerService;
        this.carService = carService;
    }
    @GetMapping
    public ResponseEntity<List<OwnerResponse>> getAllOwners() {
        List<OwnerResponse> responseBody = ownerService.getAll();
        if (responseBody.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(responseBody);
    }
    @GetMapping("/{id}")
    public ResponseEntity<OwnerResponse> getOwnerById(@PathVariable Long id) {
        OwnerResponse responseBody = ownerService.getById(id);
        return ResponseEntity.ok(responseBody);
    }
    @PostMapping
    public ResponseEntity<OwnerResponse> createOwner(@Valid @RequestBody OwnerRequest requestBody) {
        OwnerResponse responseBody = ownerService.create(requestBody);
        return ResponseEntity.created(URI.create("/owners/" + responseBody.id()))
                .body(responseBody);
    }
    @PutMapping("/{id}")
    public ResponseEntity<OwnerResponse> updateOwner(@PathVariable Long id,
                                                     @Valid @RequestBody OwnerRequest requestBody) {
        OwnerResponse responseBody = ownerService.update(id, requestBody);
        return ResponseEntity.ok(responseBody);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOwner(@PathVariable Long id) {
        ownerService.delete(id);
        return ResponseEntity.ok("Owner " + id + " deleted.");
    }

    @GetMapping("/search")
    public ResponseEntity<List<OwnerResponse>> searchOwners(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String emailContains,
            @RequestParam(required = false) String phoneContains,
            @RequestParam(required = false) Instant minCreated,
            @RequestParam(required = false) Instant maxCreated,
            @RequestParam(required = false) Instant minUpdated,
            @RequestParam(required = false) Instant maxUpdated
    ) {
        List<OwnerResponse> responseBody = ownerService.search(
                firstName, lastName, emailContains, phoneContains,
                minCreated, maxCreated, minUpdated, maxUpdated
        );
        if (responseBody.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(responseBody);
    }
    @GetMapping("/{id}/cars")
    public ResponseEntity<List<CarResponse>> getCarsByOwner(@PathVariable Long id) {
        List<CarResponse> responseBody = carService.getCarsByOwner(id);
        if (responseBody.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(responseBody);
    }
} 