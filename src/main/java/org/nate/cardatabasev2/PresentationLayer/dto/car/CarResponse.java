package org.nate.cardatabasev2.PresentationLayer.dto.car;

public record CarResponse(
        Long id,
        String brand,
        String model,
        String color,
        String registrationNumber,
        int modelYear,
        int price,
        OwnerSummary owner
) {
}