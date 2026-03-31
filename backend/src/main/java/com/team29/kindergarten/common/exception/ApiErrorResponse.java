package com.team29.kindergarten.common.exception;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;
import java.util.Map;

@Schema(description = "Standard API error response")
public record ApiErrorResponse(
        @Schema(description = "Time when the error was generated")
        OffsetDateTime timestamp,
        @Schema(description = "HTTP status code", example = "400")
        int status,
        @Schema(description = "HTTP status text", example = "Bad Request")
        String error,
        @Schema(description = "Human-readable error message", example = "Validation failed")
        String message,
        @Schema(description = "Field-level validation errors when applicable")
        Map<String, String> fieldErrors
) {
}
