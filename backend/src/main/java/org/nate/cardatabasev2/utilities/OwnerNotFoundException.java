package org.nate.cardatabasev2.utilities;

public class OwnerNotFoundException extends RuntimeException {
    public OwnerNotFoundException(Long id) {
        super("Owner not found with id: " + id);
    }
}