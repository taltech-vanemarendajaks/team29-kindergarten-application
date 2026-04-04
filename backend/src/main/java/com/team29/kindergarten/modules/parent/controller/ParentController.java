package com.team29.kindergarten.modules.parent.controller;

import com.team29.kindergarten.common.exception.ApiErrorResponse;
import com.team29.kindergarten.modules.parent.dto.ParentRequestDto;
import com.team29.kindergarten.modules.parent.dto.ParentResponseDto;
import com.team29.kindergarten.modules.parent.service.ParentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/parents")
@RequiredArgsConstructor
@Tag(name = "Parents", description = "Parent management endpoints")
public class ParentController {

    private final ParentService parentService;

    // TODO: Resolve tenantId from the authenticated principal or token instead
    // of accepting it as a request parameter once auth is implemented.

    @GetMapping
    @Operation(summary = "List parents for a tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Parents returned successfully")
    })
    public ResponseEntity<Page<ParentResponseDto>> findAll(
            @RequestParam Long tenantId,
            @ParameterObject @PageableDefault(size = 20, sort = "email") Pageable pageable
    ) {
        return ResponseEntity.ok(parentService.findAll(tenantId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get parent by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Parent returned successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Parent not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<ParentResponseDto> findById(@PathVariable Long id, @RequestParam Long tenantId) {
        return ResponseEntity.ok(parentService.findById(id, tenantId));
    }

    @PostMapping
    @Operation(summary = "Create parent")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Parent created successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid parent request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<ParentResponseDto> create(@Valid @RequestBody ParentRequestDto request, @RequestParam Long tenantId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(parentService.create(request, tenantId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update parent")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Parent updated successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid parent request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Parent not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<ParentResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody ParentRequestDto request,
            @RequestParam Long tenantId
    ) {
        return ResponseEntity.ok(parentService.update(id, request, tenantId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete parent")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Parent deleted successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Parent not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestParam Long tenantId) {
        parentService.delete(id, tenantId);
        return ResponseEntity.noContent().build();
    }
}
