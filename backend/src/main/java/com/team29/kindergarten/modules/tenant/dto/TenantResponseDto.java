package com.team29.kindergarten.modules.tenant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantResponseDto {
    private Long id;
    private String name;
    private String address;
    private String contactInfo;
    private String subscriptionPlan;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
