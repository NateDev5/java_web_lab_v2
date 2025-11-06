package org.nate.cardatabasev2.utilities;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(CarNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleCarNotFound(CarNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        pd.setTitle("Car Not Found");
        pd.setDetail(ex.getMessage());
        pd.setProperty("errors", List.of(Map.of("field", "id", "message", ex.getLocalizedMessage())));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(pd);
    }

    @ExceptionHandler(OwnerNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleOwnerNotFound(OwnerNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        pd.setTitle("Owner Not Found");
        pd.setDetail(ex.getMessage());
        pd.setProperty("errors", List.of(Map.of("field", "id", "message", ex.getLocalizedMessage())));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(pd);
    }

    @ExceptionHandler(InvalidCarDataException.class)
    public ResponseEntity<ProblemDetail> handleInvalidCarData(InvalidCarDataException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Invalid Car Data");
        pd.setDetail("Invalid Car Data");
        pd.setProperty("errors", ex.getLocalizedMessage());
        return ResponseEntity.badRequest().body(pd);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ProblemDetail> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String param = ex.getName();
        Object value = ex.getValue();
        String expected = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "value";
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Invalid Parameter");
        pd.setDetail("Invalid parameter '" + param + "'. Expected a " + expected + ".");
        pd.setProperty("errors", List.of(Map.of(
                "field", param,
                "rejectedValue", String.valueOf(value),
                "expectedType", expected,
                "message", "Parameter '" + param + "' must be of type " + expected + "."
        )));
        return ResponseEntity.badRequest().body(pd);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ProblemDetail> handleConstraintViolation(ConstraintViolationException ex) {
        List<Map<String, Object>> errors = ex.getConstraintViolations().stream()
                .map(violation -> Map.of(
                        "field", violation.getPropertyPath() != null ? violation.getPropertyPath() : "parameter",
                        "rejectedValue", String.valueOf(violation.getInvalidValue()),
                        "message", violation.getMessage() != null ? violation.getMessage() : "Constraint violated",
                        "rule", violation.getConstraintDescriptor() != null
                                ? violation.getConstraintDescriptor().getAnnotation().annotationType().getSimpleName()
                                : "Constraint"
                ))
                .toList();
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Invalid Request Parameter");
        pd.setDetail("One or more request parameters are invalid.");
        pd.setProperty("errors", errors);
        return ResponseEntity.badRequest().body(pd);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleInvalidBody(MethodArgumentNotValidException ex) {
        List<Map<String, Object>> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> Map.of(
                        "object", error.getObjectName(),
                        "field", error.getField(),
                        "rejectedValue", error.getRejectedValue() != null ? error.getRejectedValue() : "null",
                        "message", error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid value",
                        "rule", error.getCode() != null ? error.getCode() : "Validation"
                ))
                .toList();
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Invalid Request Body");
        pd.setDetail("One or more fields failed validation.");
        pd.setProperty("errors", errors);
        return ResponseEntity.badRequest().body(pd);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ProblemDetail> handleUnreadable(HttpMessageNotReadableException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Malformed JSON");
        pd.setDetail("Body is invalid JSON or contains fields with the wrong type.");
        pd.setProperty("errors", List.of(Map.of("field", "body", "message", "Malformed or invalid JSON." + ex.getLocalizedMessage())));
        return ResponseEntity.badRequest().body(pd);
    }

    @ExceptionHandler(OwnerHasCarsException.class)
    public ResponseEntity<ProblemDetail> handleOwnerHasCars(OwnerHasCarsException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        pd.setTitle("Owner Has Cars");
        pd.setDetail(ex.getMessage());
        pd.setProperty("errors", List.of(Map.of("field", "ownerId", "message", ex.getMessage())));
        return ResponseEntity.status(HttpStatus.CONFLICT).body(pd);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ProblemDetail> handleDuplicateResource(DuplicateResourceException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        pd.setTitle("Duplicate Resource");
        pd.setDetail(ex.getMessage());
        pd.setProperty("errors", List.of(Map.of("field", "resource", "message", ex.getMessage())));
        return ResponseEntity.status(HttpStatus.CONFLICT).body(pd);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetail> handleIntegrity(DataIntegrityViolationException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);

        pd.setTitle("Data Integrity Violation");
        pd.setDetail("A database constraint was violated (unique or foreign key constraint).");
        pd.setProperty("errors", List.of(Map.of("field", "database", "message", "Constraint violation.")));
        return ResponseEntity.status(HttpStatus.CONFLICT).body(pd);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGeneric(Exception ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        pd.setTitle("Internal Server Error");
        pd.setDetail("An unexpected error occurred.");
        pd.setProperty("errors", List.of(Map.of("field", "server", "message", ex.getMessage())));
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(pd);
    }
}