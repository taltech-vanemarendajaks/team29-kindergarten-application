package com.team29.kindergarten.modules.user.controller;

import com.team29.kindergarten.common.dto.PageResponseDto;
import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import com.team29.kindergarten.modules.user.dto.CreateUserRequestDto;
import com.team29.kindergarten.modules.user.dto.UpdateUserRequestDto;
import com.team29.kindergarten.modules.user.dto.UserResponseDto;
import com.team29.kindergarten.modules.user.service.UserService;
import com.team29.kindergarten.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    private final UserService userService;

    /**
     * Use this endpoint for management tables and other list views that need paging metadata.
     */
    @GetMapping
    @Operation(summary = "List users for the authenticated tenant by role with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users returned successfully")
    })
    public ResponseEntity<PageResponseDto<UserResponseDto>> findUsersByRole(
        @RequestParam RoleName role,
        @RequestParam(required = false) String search,
        @ParameterObject @PageableDefault(size = 20, sort = "fullName") Pageable pageable
) {
    Long tenantId = TenantContext.getTenantId();
    return ResponseEntity.ok(PageResponseDto.from(userService.findUsersByRole(tenantId, role, search, pageable)));
}

    /**
     * Use this endpoint for select/dropdown options when the UI needs the full role-filtered list.
     */
    @GetMapping("/options")
    @Operation(summary = "List user options for the authenticated tenant by role without pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User options returned successfully")
    })
    public ResponseEntity<List<UserResponseDto>> findUserOptionsByRole(@RequestParam RoleName role) {
        Long tenantId = TenantContext.getTenantId();
        return ResponseEntity.ok(userService.findUserOptionsByRole(tenantId, role));
    }

    @GetMapping("/teachers/available-options")
    @Operation(summary = "List available teacher options for group assignment")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Available teacher options returned successfully")
    })
    public ResponseEntity<List<UserResponseDto>> findAvailableTeachersForGroup(
            @RequestParam(required = false) Long groupId
    ) {
        Long tenantId = TenantContext.getTenantId();
        return ResponseEntity.ok(userService.findAvailableTeachersForGroup(tenantId, groupId));
    }

    @PostMapping("/teachers")
    @Operation(summary = "Create a teacher user in the authenticated tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Teacher user created successfully")
    })
    public ResponseEntity<UserResponseDto> createTeacher(@Valid @RequestBody CreateUserRequestDto request) {
        Long tenantId = TenantContext.getTenantId();
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createTeacherUser(tenantId, request));
    }

    @PutMapping("/teachers/{id}")
    @Operation(summary = "Update a teacher user in the authenticated tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Teacher user updated successfully")
    })
    public ResponseEntity<UserResponseDto> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequestDto request
    ) {
        Long tenantId = TenantContext.getTenantId();
        return ResponseEntity.ok(userService.updateTeacherUser(id, tenantId, request));
    }

    @DeleteMapping("/teachers/{id}")
    @Operation(summary = "Delete a teacher user in the authenticated tenant")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Teacher user deleted successfully"),
            @ApiResponse(responseCode = "409", description = "Teacher cannot be deleted because they are assigned to a group")
    })
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        Long tenantId = TenantContext.getTenantId();
        userService.deleteTeacherUser(id, tenantId);
        return ResponseEntity.noContent().build();
    }
}
