package org.nate.cardatabasev2;

import org.nate.cardatabasev2.DataAccessLayer.Car;
import org.nate.cardatabasev2.DataAccessLayer.CarRepository;
import org.nate.cardatabasev2.DataAccessLayer.Owner;
import org.nate.cardatabasev2.DataAccessLayer.OwnerRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Cardatabasev2Application {
    private static final Logger log = LoggerFactory.getLogger(Cardatabasev2Application.class);
    public static void main(String[] args) {
        SpringApplication.run(Cardatabasev2Application.class, args);
    }
    @Bean
    CommandLineRunner seed(OwnerRepository owners, CarRepository cars) {
        return args -> {
            Owner alice = owners.save(
                    Owner.builder().firstName("Alice").lastName("Smith").email("alice@example.com").phone("+1-555-1111").build()
            );
            Owner bob = owners.save(
                    Owner.builder().firstName("Bob").lastName("Jones").email("bob@example.com").phone("+1-555-2222").build()
            );

            cars.save(Car.builder()
                    .brand("Ford").model("Mustang").color("Red")
                    .registrationNumber("ADF-1121").modelYear(2023).price(59000)
                    .owner(alice)
                    .build());
            cars.save(Car.builder()
                    .brand("Toyota").model("Prius").color("Silver")
                    .registrationNumber("KKO-0212").modelYear(2022).price(39000)
                    .owner(alice)
                    .build());
            cars.save(Car.builder()
                    .brand("Toyota").model("Corolla").color("Blue")
                    .registrationNumber("ABC-1234").modelYear(2020).price(20000)
                    .owner(bob)
                    .build());
            log.info("Seeded {} owners and {} cars", owners.count(), cars.count());
        };
    }
} 