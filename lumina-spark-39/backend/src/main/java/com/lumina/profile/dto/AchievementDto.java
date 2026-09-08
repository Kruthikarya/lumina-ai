package com.lumina.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AchievementDto(
        String id,
        @NotBlank @Size(max = 200) String title,
        @Size(max = 40) String type,
        @Size(max = 20) String year
) {}
