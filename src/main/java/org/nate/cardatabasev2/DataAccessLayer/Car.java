package org.nate.cardatabasev2.DataAccessLayer;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
@Entity
@Table(
        name = "cars_inventory",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_car_registration", columnNames = "registration_number")
        },
        indexes = {
                @Index(name = "idx_brand", columnList = "brand"),
                @Index(name = "idx_model_year", columnList = "model_year"),
                @Index(name = "idx_owner_id", columnList = "owner_id")
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String brand;

    @Column(name = "car_model", nullable = false, length = 120)
    private String model;

    @Column(nullable = false, length = 40)
    private String color;

    @Column(name = "registration_number", nullable = false, length = 40)
    private String registrationNumber;

    @Column(name = "model_year", nullable = false)
    private int modelYear;

    @Column(nullable = false)
    private int price;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "owner_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_car_owner")
    )
    private Owner owner;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;
}