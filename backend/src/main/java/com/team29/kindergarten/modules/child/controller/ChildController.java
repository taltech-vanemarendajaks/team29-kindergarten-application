package com.team29.kindergarten.modules.child.controller;

import com.team29.kindergarten.common.exception.ApiErrorResponse;
import com.team29.kindergarten.modules.child.dto.ChildRequestDto;
import com.team29.kindergarten.modules.child.dto.ChildResponseDto;
import com.team29.kindergarten.modules.child.service.ChildService;
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
import org.springframework.web.bind.annotation.*;
import com.team29.kindergarten.tenant.TenantContext;

@RestController
@RequestMapping("/api/v1/children")
@RequiredArgsConstructor
@Tag(name = "Children", description = "Child management endpoints")
public class ChildController {

    private final ChildService childService;

    @GetMapping
    @Operation(summary = "List children for a tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Children returned successfully")
    })
  public ResponseEntity<Page<ChildResponseDto>> findAll(
        @ParameterObject @PageableDefault(size = 20, sort = "lastName") Pageable pageable
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(childService.findAll(tenantId, pageable));
}

    @GetMapping("/{id}")
    @Operation(summary = "Get child by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Child returned successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Child not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<ChildResponseDto> findById(@PathVariable Long id) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(childService.findById(id, tenantId));
}

    @PostMapping
    @Operation(summary = "Create child and link the creating parent")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Child created and linked successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid child request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Related parent or group not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<ChildResponseDto> create(
        @Valid @RequestBody ChildRequestDto request,
        @RequestParam Long parentId
) {
    Long tenantId = TenantContext.getTenantId();
    ChildResponseDto createdChild = childService.create(request, tenantId, parentId);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdChild);
}

    @PostMapping("/{id}/parents/{parentId}")
    @Operation(summary = "Link an additional parent to a child")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Parent linked to child successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid child-parent link request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Child or parent not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
   public ResponseEntity<Void> addParentLink(
        @PathVariable Long id,
        @PathVariable Long parentId
) {
    Long tenantId = TenantContext.getTenantId();
    childService.addParentLink(id, parentId, tenantId);
    return ResponseEntity.status(HttpStatus.CREATED).build();
}

    @PutMapping("/{id}")
    @Operation(summary = "Update child")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Child updated successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid child request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Child or related group not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<ChildResponseDto> update(
        @PathVariable Long id,
        @Valid @RequestBody ChildRequestDto request
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(childService.update(id, request, tenantId));
}

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete child")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Child deleted successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Child not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    Long tenantId = TenantContext.getTenantId();
    childService.delete(id, tenantId);
    return ResponseEntity.noContent().build();
}
}
