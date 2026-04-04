package com.team29.kindergarten.modules.group.controller;

import com.team29.kindergarten.common.exception.ApiErrorResponse;
import com.team29.kindergarten.modules.group.dto.GroupRequestDto;
import com.team29.kindergarten.modules.group.dto.GroupResponseDto;
import com.team29.kindergarten.modules.group.service.GroupService;
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

@RestController
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
@Tag(name = "Groups", description = "Group management endpoints")
public class GroupController {

    private final GroupService groupService;

    // TODO: Resolve tenantId from the authenticated principal or token instead
    // of accepting it as a request parameter once auth is implemented.

    @GetMapping
    @Operation(summary = "List groups for a tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Groups returned successfully")
    })
    public ResponseEntity<List<GroupResponseDto>> findAll(@RequestParam Long tenantId) {
        return ResponseEntity.ok(groupService.findAll(tenantId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get group by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Group returned successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Group not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<GroupResponseDto> findById(@PathVariable Long id, @RequestParam Long tenantId) {
        return ResponseEntity.ok(groupService.findById(id, tenantId));
    }

    @PostMapping
    @Operation(summary = "Create group")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Group created successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid group request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Related tenant or teacher not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<GroupResponseDto> create(@Valid @RequestBody GroupRequestDto request, @RequestParam Long tenantId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupService.create(request, tenantId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update group")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Group updated successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid group request",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Group or related teacher not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<GroupResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody GroupRequestDto request,
            @RequestParam Long tenantId
    ) {
        return ResponseEntity.ok(groupService.update(id, request, tenantId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete group")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Group deleted successfully"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Group not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
            )
    })
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestParam Long tenantId) {
        groupService.delete(id, tenantId);
        return ResponseEntity.noContent().build();
    }
}
