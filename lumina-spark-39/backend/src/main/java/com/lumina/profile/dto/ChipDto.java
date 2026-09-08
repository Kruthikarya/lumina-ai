package com.lumina.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChipDto(
        String id,
        @NotBlank @Size(max = 80) String label
) {}
