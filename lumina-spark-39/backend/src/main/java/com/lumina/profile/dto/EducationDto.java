package com.lumina.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EducationDto(
        String id,
        @NotBlank @Size(max = 160) String degree,
        @NotBlank @Size(max = 160) String college,
        @Size(max = 40) String year,
        @Size(max = 40) String score
) {}
