package org.nate.cardatabasev2.DataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.List;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    boolean existsByEmailIgnoreCase(String email);
    @Query("""
 SELECT o
 FROM Owner o
 WHERE (:firstName IS NULL OR LOWER(o.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')))
 AND (:lastName IS NULL OR LOWER(o.lastName) LIKE LOWER(CONCAT('%', :lastName, '%')))
 AND (:emailPart IS NULL OR LOWER(o.email) LIKE LOWER(CONCAT('%', :emailPart, '%')))
 AND (:phonePart IS NULL OR (o.phone IS NOT NULL AND LOWER(o.phone) LIKE LOWER(CONCAT('%', :phonePart, '%'))))
 AND (:minCreated IS NULL OR o.createdAt >= :minCreated)
 AND (:maxCreated IS NULL OR o.createdAt <= :maxCreated)
 AND (:minUpdated IS NULL OR o.updatedAt >= :minUpdated)
 AND (:maxUpdated IS NULL OR o.updatedAt <= :maxUpdated)
 """)

    List<Owner> searchAll(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("emailPart") String emailPart,
            @Param("phonePart") String phonePart,
            @Param("minCreated") Instant minCreated,
            @Param("maxCreated") Instant maxCreated,
            @Param("minUpdated") Instant minUpdated,
            @Param("maxUpdated") Instant maxUpdated
    );
}