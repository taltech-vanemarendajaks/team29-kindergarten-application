package com.team29.kindergarten.modules.attendance.controller;

import com.team29.kindergarten.common.exception.ApiErrorResponse;
import com.team29.kindergarten.modules.attendance.dto.AttendanceRequestDto;
import com.team29.kindergarten.modules.attendance.dto.AttendanceResponseDto;
import com.team29.kindergarten.modules.attendance.service.AttendanceService;
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
import org.springframework.format.annotation.DateTimeFormat;
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

import com.team29.kindergarten.tenant.TenantContext;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendances")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Attendance management endpoints")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    @Operation(summary = "List attendance records for a tenant or child date range")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Attendance records returned successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid attendance filter parameters",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Child not found for the current tenant",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<?> findAll(
            @RequestParam(required = false) Long childId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @ParameterObject @PageableDefault(size = 20, sort = "id") Pageable pageable
    ) {
        Long tenantId = TenantContext.getTenantId();
        if (childId != null) {
            List<AttendanceResponseDto> childAttendance = attendanceService.findForChildInRange(childId, from, to, tenantId);
            return ResponseEntity.ok(childAttendance);
        }
        return ResponseEntity.ok(attendanceService.findAll(tenantId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get attendance record by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Attendance record returned successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Attendance record not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
   public ResponseEntity<AttendanceResponseDto> findById(@PathVariable Long id) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(attendanceService.findById(id, tenantId));
}

    @PostMapping
    @Operation(summary = "Create attendance record")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Attendance record created successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid attendance request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Related child not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<AttendanceResponseDto> create(
        @Valid @RequestBody AttendanceRequestDto request
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.create(request, tenantId));
}


    @PutMapping("/{id}")
    @Operation(summary = "Update attendance record")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Attendance record updated successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid attendance request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Attendance record or related child not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<AttendanceResponseDto> update(
        @PathVariable Long id,
        @Valid @RequestBody AttendanceRequestDto request
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(attendanceService.update(id, request, tenantId));
}


    @DeleteMapping("/{id}")
    @Operation(summary = "Delete attendance record")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Attendance record deleted successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Attendance record not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    Long tenantId = TenantContext.getTenantId();
    attendanceService.delete(id, tenantId);
    return ResponseEntity.noContent().build();
}
}
