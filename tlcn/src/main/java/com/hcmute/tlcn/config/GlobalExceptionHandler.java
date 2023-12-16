package com.hcmute.tlcn.config;

import com.hcmute.tlcn.dtos.MessageDto;
import com.hcmute.tlcn.exceptions.BadRequestException;
import com.hcmute.tlcn.exceptions.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageDto<String>> handleServerException(Exception e) {
        return ResponseEntity.status(500)
                .body(new MessageDto<String>(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        e.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<MessageDto<String>> handleBadRequestException(Exception e) {
        return ResponseEntity.status(400)
                .body(new MessageDto<String>(HttpStatus.BAD_REQUEST.value(),
                        e.getMessage()));
    }
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<MessageDto<String>> handleNotFoundException(Exception e) {
        return ResponseEntity.status(400)
                .body(new MessageDto<String>(HttpStatus.NOT_FOUND.value(),
                        e.getMessage()));
    }
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageDto<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(400).body(new MessageDto<Map<String, String>>(
                HttpStatus.BAD_REQUEST.value(),
                errors));
    }
}
