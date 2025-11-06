package org.nate.cardatabasev2.PresentationLayer.dto.car;

public record OwnerSummary(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone
) {
}