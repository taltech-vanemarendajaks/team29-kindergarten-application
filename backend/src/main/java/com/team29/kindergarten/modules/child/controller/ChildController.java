package com.team29.kindergarten.modules.child.controller;

import com.team29.kindergarten.common.dto.PageResponseDto;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.team29.kindergarten.tenant.TenantContext;
import com.team29.kindergarten.modules.user.entity.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.List;

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
  public ResponseEntity<PageResponseDto<ChildResponseDto>> findAll(
        @ParameterObject @PageableDefault(size = 20, sort = "lastName") Pageable pageable
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(PageResponseDto.from(childService.findAll(tenantId, pageable)));
}

    @GetMapping("/unassigned")
    @Operation(summary = "List unassigned children for a tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Unassigned children returned successfully")
    })
  public ResponseEntity<PageResponseDto<ChildResponseDto>> findUnassigned(
        @ParameterObject @PageableDefault(size = 10, sort = "lastName") Pageable pageable
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(PageResponseDto.from(childService.findUnassigned(tenantId, pageable)));
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

    @GetMapping("/class-records")
    @Operation(summary = "Get children in the teacher's assigned group")
    @ApiResponses({
                @ApiResponse(responseCode = "200", description = "Class records returned successfully"),
                @ApiResponse(
                        responseCode = "404",
                        description = "No group found for this teacher",
                        content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
                )
        })

public ResponseEntity<List<ChildResponseDto>> findClassRecords(
        @AuthenticationPrincipal User currentUser
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(childService.findAllByTeacher(currentUser.getId(), tenantId));
}

    @PostMapping
    @Operation(summary = "Create child")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Child created successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid child request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Related group not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<ChildResponseDto> create(
        @Valid @RequestBody ChildRequestDto request
) {
    Long tenantId = TenantContext.getTenantId();
    ChildResponseDto createdChild = childService.create(request, tenantId);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdChild);
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
