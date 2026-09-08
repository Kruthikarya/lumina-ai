package com.lumina.profile.dto;

import com.lumina.profile.entity.SkillCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SkillRequest(
        @NotNull SkillCategory category,
        @NotBlank @Size(max = 80) String label
) {}
