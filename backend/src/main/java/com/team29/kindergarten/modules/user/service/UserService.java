package com.team29.kindergarten.modules.user.service;

import com.team29.kindergarten.modules.auth.entity.Role;
import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import com.team29.kindergarten.modules.auth.repository.RoleRepository;
import com.team29.kindergarten.modules.user.dto.CreateUserRequestDto;
import com.team29.kindergarten.modules.user.dto.UpdateUserRequestDto;
import com.team29.kindergarten.modules.user.dto.UserResponseDto;
import com.team29.kindergarten.modules.user.entity.User;
import com.team29.kindergarten.modules.user.mapper.UserMapper;
import com.team29.kindergarten.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    
    public Page<UserResponseDto> findUsersByRole(Long tenantId, RoleName roleName, Pageable pageable) {
        return userRepository.findDistinctByTenantIdAndRoles_NameOrderByFullNameAsc(tenantId, roleName, pageable)
                .map(userMapper::toUserResponseDto);
    }

    public List<UserResponseDto> findUserOptionsByRole(Long tenantId, RoleName roleName) {
        return userRepository.findDistinctByTenantIdAndRoles_NameOrderByFullNameAsc(tenantId, roleName)
                .stream()
                .map(userMapper::toUserResponseDto)
                .toList();
    }

    @Transactional
    public UserResponseDto createTeacherUser(Long tenantId, CreateUserRequestDto request) {
        return createUserWithRole(tenantId, request, RoleName.TEACHER);
    }

    @Transactional
    public UserResponseDto updateTeacherUser(Long id, Long tenantId, UpdateUserRequestDto request) {
        User user = getUserByRole(id, tenantId, RoleName.TEACHER);
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmailAndIdNot(normalizedEmail, id)) {
            throw new IllegalArgumentException("Email already exists");
        }

        user.setFullName(normalizeWhitespace(request.getFullName()));
        user.setEmail(normalizedEmail);

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        return userMapper.toUserResponseDto(userRepository.save(user));
    }

    @Transactional
    public void deleteTeacherUser(Long id, Long tenantId) {
        User user = getUserByRole(id, tenantId, RoleName.TEACHER);
        userRepository.delete(user);
    }

    private UserResponseDto createUserWithRole(Long tenantId, CreateUserRequestDto request, RoleName roleName) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email already exists");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        User user = User.builder()
                .fullName(normalizeWhitespace(request.getFullName()))
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .tenantId(tenantId)
                .roles(Set.of(role))
                .build();

        return userMapper.toUserResponseDto(userRepository.save(user));
    }

    private User getUserByRole(Long id, Long tenantId, RoleName roleName) {
        return userRepository.findByIdAndTenantIdAndRoles_Name(id, tenantId, roleName)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private String normalizeWhitespace(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }

    private String normalizeEmail(String value) {
        return value.trim().toLowerCase();
    }
}
