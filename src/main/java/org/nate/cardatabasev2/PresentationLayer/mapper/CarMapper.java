package org.nate.cardatabasev2.PresentationLayer.mapper;

import org.nate.cardatabasev2.DataAccessLayer.Car;
import org.nate.cardatabasev2.DataAccessLayer.Owner;
import org.nate.cardatabasev2.PresentationLayer.dto.car.CarRequest;
import org.nate.cardatabasev2.PresentationLayer.dto.car.CarResponse;
import org.nate.cardatabasev2.PresentationLayer.dto.car.OwnerSummary;

public final class CarMapper {
    private CarMapper() {
    }
    public static Car toEntity(CarRequest req, Owner owner) {
        return Car.builder()
                .brand(req.brand())
                .model(req.model())
                .color(req.color())
                .registrationNumber(req.registrationNumber())
                .modelYear(req.modelYear())
                .price(req.price())
                .owner(owner)
                .build();
    }

    public static CarResponse toResponse(Car car) {
        Owner o = car.getOwner();
        OwnerSummary ownerDto = (o == null) ? null : new OwnerSummary(
                o.getId(),
                o.getFirstName(),
                o.getLastName(),
                o.getEmail(),
                o.getPhone()
        );
        return new CarResponse(
                car.getId(),
                car.getBrand(),
                car.getModel(),
                car.getColor(),
                car.getRegistrationNumber(),
                car.getModelYear(),
                car.getPrice(),
                ownerDto
        );
    }
}