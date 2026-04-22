package com.team29.kindergarten.modules.announcement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementRequestDto {

    @NotBlank(message = "Tile is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @NotBlank(message = "Message is required")
    @Size(max = 100, message = "message must not exceed 100 characters")
    private String message;

    @Past(message = "Expiring date must not be in the past")
    private LocalDate expires_At;


}
