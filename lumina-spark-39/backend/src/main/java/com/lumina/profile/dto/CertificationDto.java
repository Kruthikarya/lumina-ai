package com.lumina.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CertificationDto(
        String id,
        @NotBlank @Size(max = 200) String name,
        @NotBlank @Size(max = 160) String org,
        @Size(max = 40) String date,
        @Size(max = 500) String url
) {}
