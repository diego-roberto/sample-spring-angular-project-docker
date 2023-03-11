package org.project.responses;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

@NoArgsConstructor
public final class ErrorResponse {

    private static final String KEY_ERRORS = "errors";
    private static final String KEY_GLOBAL = "global";

    @SuppressWarnings("rawtypes")
    public static ResponseEntity<HashMap> handle(Errors e, HttpStatus status) {
        final List<MessageError> errors = new ArrayList<>();

        for (final FieldError error : e.getFieldErrors()) {
            errors.add(new MessageError(error.getField(), "field", error.getDefaultMessage()));
        }

        for (final ObjectError error : e.getGlobalErrors()) {
            errors.add(new MessageError(error.getObjectName(), KEY_GLOBAL, error.getDefaultMessage()));
        }

        HashMap<String, List<MessageError>> result = new HashMap<String, List<MessageError>>();
        result.put(KEY_ERRORS, errors);

        return new ResponseEntity<HashMap>(result, status);
    }

    @SuppressWarnings("rawtypes")
    public static ResponseEntity<HashMap> handle(String[] messages, Class<?> klass, HttpStatus status) {
        final List<MessageError> errors = new ArrayList<MessageError>();

        for (final String message : messages) {
            errors.add(new MessageError(klass.getSimpleName(), KEY_GLOBAL, message));
        }

        HashMap<String, List<MessageError>> result = new HashMap<String, List<MessageError>>();
        result.put(KEY_ERRORS, errors);

        return new ResponseEntity<HashMap>(result, status);
    }

    @SuppressWarnings("rawtypes")
    public static ResponseEntity<HashMap> handle(String message, Class<?> klass, HttpStatus status) {
        final List<MessageError> errors = new ArrayList<MessageError>();

        errors.add(new MessageError(klass.getSimpleName(), KEY_GLOBAL, message));

        HashMap<String, List<MessageError>> result = new HashMap<String, List<MessageError>>();
        result.put(KEY_ERRORS, errors);

        return new ResponseEntity<HashMap>(result, status);
    }

}