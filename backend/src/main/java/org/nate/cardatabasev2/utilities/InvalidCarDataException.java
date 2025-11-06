package org.nate.cardatabasev2.utilities;

public class InvalidCarDataException extends RuntimeException {
    public InvalidCarDataException(String message) {
        super(message);
    }
}
