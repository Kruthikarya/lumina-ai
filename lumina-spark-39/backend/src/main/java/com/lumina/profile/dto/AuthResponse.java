package com.lumina.profile.dto;

public record AuthResponse(
        String token,
        String tokenType,
        Long studentId,
        String email,
        String fullName
) {
    public static AuthResponse bearer(String token, Long studentId, String email, String fullName) {
        return new AuthResponse(token, "Bearer", studentId, email, fullName);
    }
}
