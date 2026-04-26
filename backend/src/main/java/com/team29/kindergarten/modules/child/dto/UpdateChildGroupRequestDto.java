package com.team29.kindergarten.modules.child.dto;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateChildGroupRequestDto {

    @Positive(message = "Group ID must be a positive number")
    private Long groupId;
}
