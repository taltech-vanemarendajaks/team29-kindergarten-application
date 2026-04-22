package com.team29.kindergarten.modules.announcement.controller;

import com.team29.kindergarten.common.exception.ApiErrorResponse;
import com.team29.kindergarten.modules.announcement.dto.AnnouncementResponseDto;
import com.team29.kindergarten.modules.announcement.service.AnnouncementService;
import com.team29.kindergarten.modules.announcement.dto.AnnouncementRequestDto;
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
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
@Tag(name = "Announcements", description = "Announcement endpoints")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    @Operation(summary = "List announcements for a tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Announcements returned successfully")
    })
  public ResponseEntity<Page<AnnouncementResponseDto>> findAll(
        @ParameterObject @PageableDefault(size = 20, sort = "created_at") Pageable pageable
        ) {
        Long tenantId = TenantContext.getTenantId();
        return ResponseEntity.ok(announcementService.findAll(tenantId, pageable));
        }

    @GetMapping("/{id}")
    @Operation(summary = "Get announcement by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Announcement returned successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Announcement not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<AnnouncementResponseDto> findById(@PathVariable Long id) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(announcementService.findById(id, tenantId));
}

    @PostMapping
    @Operation(summary = "Create announcement")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Announcement created"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid announcement request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )

    })
  public ResponseEntity<AnnouncementResponseDto> create(
        @Valid @RequestBody AnnouncementRequestDto request,
        @RequestParam Long userId
) {
    Long tenantId = TenantContext.getTenantId();
    AnnouncementResponseDto createdChild = announcementService.create(request, tenantId, userId);
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

    return ResponseEntity.status(HttpStatus.CREATED).build();
}

    @PutMapping("/{id}")
    @Operation(summary = "Update announcement")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Announcement updated successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid announcement request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Announcement or related user not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<AnnouncementResponseDto> update(
        @PathVariable Long id,
        @Valid @RequestBody AnnouncementRequestDto request
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(announcementService.update(id, request, tenantId));
}

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete announcement")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Announcement deleted successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Announcement not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    Long tenantId = TenantContext.getTenantId();
    announcementService.delete(id, tenantId);
    return ResponseEntity.noContent().build();
}
}
