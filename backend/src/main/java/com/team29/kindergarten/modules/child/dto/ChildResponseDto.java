package com.team29.kindergarten.modules.child.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildResponseDto {
    private Long id;
    private Long tenantId;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private ChildGroupSummaryDto group;
    private List<ParentSummaryDto> parents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
