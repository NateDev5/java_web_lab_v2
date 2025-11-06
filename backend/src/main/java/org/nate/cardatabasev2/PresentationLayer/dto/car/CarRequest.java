package org.nate.cardatabasev2.PresentationLayer.dto.car;

import jakarta.validation.constraints.*;
public record CarRequest(
        @NotBlank String brand,
        @NotBlank String model,
        @NotBlank String color,
        @NotBlank String registrationNumber,
        @NotNull @Min(1900) Integer modelYear,
        @NotNull @Min(0) Integer price,
        @NotNull @Positive Long ownerId
){

}