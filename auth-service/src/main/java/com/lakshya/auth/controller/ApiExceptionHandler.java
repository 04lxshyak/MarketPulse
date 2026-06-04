package com.lakshya.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleResponseStatus(ResponseStatusException exception) {
        String message = exception.getReason() != null ? exception.getReason() : exception.getStatusCode().toString();
        return ResponseEntity.status(exception.getStatusCode()).body(message);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidation(MethodArgumentNotValidException exception) {
        return ResponseEntity.badRequest().body("Please provide a valid name, email, and password");
    }
}
