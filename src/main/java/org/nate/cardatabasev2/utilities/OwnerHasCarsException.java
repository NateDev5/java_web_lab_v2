package org.nate.cardatabasev2.utilities;

public class OwnerHasCarsException extends RuntimeException {
    public OwnerHasCarsException(Long ownerId) {
        super("Owner " + ownerId + " cannot be deleted because they still own cars.");
    }
}