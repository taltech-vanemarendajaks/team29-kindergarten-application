package com.team29.kindergarten.modules.teacher.controller;

import com.team29.kindergarten.common.exception.ApiErrorResponse;
import com.team29.kindergarten.modules.teacher.dto.TeacherRequestDto;
import com.team29.kindergarten.modules.teacher.dto.TeacherResponseDto;
import com.team29.kindergarten.modules.teacher.service.TeacherService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.team29.kindergarten.tenant.TenantContext;

/**
 * @deprecated Legacy endpoints backed by the teacher table.
 * As decided, teacher and parent accounts should be managed through the users table instead of
 * separate teacher/parent tables. Do not use these endpoints for new flows; use the user
 * controller instead. Remove this controller once the remaining teacher-table dependencies are gone.
 */
@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
@Deprecated(since = "2026-04-11", forRemoval = false)
@Tag(name = "Teachers", description = "Teacher management endpoints")
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    @Operation(summary = "List teachers for a tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Teachers returned successfully")
    })
   public ResponseEntity<List<TeacherResponseDto>> findAll() {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(teacherService.findAll(tenantId));
}

    @GetMapping("/{id}")
    @Operation(summary = "Get teacher by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Teacher returned successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Teacher not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
   public ResponseEntity<TeacherResponseDto> findById(@PathVariable Long id) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(teacherService.findById(id, tenantId));
}

    @PostMapping
    @Operation(summary = "Create teacher")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Teacher created successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid teacher request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
 public ResponseEntity<TeacherResponseDto> create(@Valid @RequestBody TeacherRequestDto request) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.status(HttpStatus.CREATED).body(teacherService.create(request, tenantId));
}

    @PutMapping("/{id}")
    @Operation(summary = "Update teacher")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Teacher updated successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid teacher request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Teacher not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
   public ResponseEntity<TeacherResponseDto> update(
        @PathVariable Long id,
        @Valid @RequestBody TeacherRequestDto request
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(teacherService.update(id, request, tenantId));
}

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete teacher")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Teacher deleted successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Teacher not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    Long tenantId = TenantContext.getTenantId();
    teacherService.delete(id, tenantId);
    return ResponseEntity.noContent().build();
}

}
