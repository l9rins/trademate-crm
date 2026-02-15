package com.trademate.exception;

/**
 * Thrown when a requested entity (Client, Job, etc.) is not found in the
 * database.
 * Handled by GlobalExceptionHandler → 404 NOT_FOUND.
 */
public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(String message) {
        super(message);
    }
}
