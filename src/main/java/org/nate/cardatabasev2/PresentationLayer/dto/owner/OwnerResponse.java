package org.nate.cardatabasev2.PresentationLayer.dto.owner;

import java.time.Instant;

public record OwnerResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        Instant createdAt,
        Instant updatedAt,
        long carCount
) {
}