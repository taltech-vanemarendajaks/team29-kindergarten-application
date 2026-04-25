package com.team29.kindergarten.modules.announcement.controller;
import com.team29.kindergarten.security.UserPrincipal;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    @ParameterObject Pageable pageable
) {
    Long tenantId = TenantContext.getTenantId();

    Pageable safePageable = PageRequest.of(
        pageable.getPageNumber(),
        pageable.getPageSize(),
        Sort.by("createdAt").descending()
    );

    return ResponseEntity.ok(announcementService.findAll(tenantId, safePageable));
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
    @AuthenticationPrincipal UserPrincipal user

) {
        //tenant and user from Token/UserPrincipal
         Long userId = user.getUserId();
         Long tenantId = user.getTenantId();

    AnnouncementResponseDto createdAnnouncement = announcementService.create(request, tenantId, userId);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdAnnouncement);
}



/** 
@DeleteMapping("/{id}")
@Operation(summary = "Delete announcement")
@ApiResponses({
                @ApiResponse(responseCode = "204", description = "Announcement deleted successfully"),
                @ApiResponse(responseCode = "404", description = "Announcement not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
})
public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long tenantId = TenantContext.getTenantId();
        announcementService.delete(id, tenantId);
        return ResponseEntity.noContent().build();
}

    @PostMapping("/{id}/read/")
    @Operation(summary = "Mark announcement read by user")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Read status marked for announcement"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid announcement read status update request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Announcement not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })    
public ResponseEntity<Long> markAnnouncementRead(
    @AuthenticationPrincipal UserPrincipal user
) {
    Long userId = user.getUserId();
    Long unReadAnnouncements = announcementService.createReadRecord(1L, userId);
    return ResponseEntity.ok(unReadAnnouncements);
}

*/


}
