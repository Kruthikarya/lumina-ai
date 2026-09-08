package com.lumina.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ExperienceDto(
        String id,
        @NotBlank @Size(max = 160) String company,
        @NotBlank @Size(max = 160) String role,
        @Size(max = 80) String duration,
        @Size(max = 4000) String description
) {}
