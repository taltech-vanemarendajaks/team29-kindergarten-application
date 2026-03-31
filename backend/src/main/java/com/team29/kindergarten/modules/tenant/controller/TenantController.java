package com.team29.kindergarten.modules.tenant.controller;

import com.team29.kindergarten.common.exception.ApiErrorResponse;
import com.team29.kindergarten.modules.tenant.dto.TenantRequestDto;
import com.team29.kindergarten.modules.tenant.dto.TenantResponseDto;
import com.team29.kindergarten.modules.tenant.service.TenantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
@Tag(name = "Tenants", description = "Tenant management endpoints")
public class TenantController {

    private final TenantService tenantService;

    @GetMapping
    @Operation(summary = "List tenants")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tenants returned successfully")
    })
    public ResponseEntity<List<TenantResponseDto>> findAll() {
        return ResponseEntity.ok(tenantService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tenant by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tenant returned successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Tenant not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<TenantResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tenant created successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid tenant request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<TenantResponseDto> create(@Valid @RequestBody TenantRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tenantService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tenant updated successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid tenant request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Tenant not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<TenantResponseDto> update(@PathVariable Long id, @Valid @RequestBody TenantRequestDto request) {
        return ResponseEntity.ok(tenantService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Tenant deleted successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Tenant not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tenantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
