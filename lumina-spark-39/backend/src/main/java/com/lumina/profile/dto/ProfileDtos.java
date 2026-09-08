package com.lumina.profile.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class ProfileDtos {

    public record ChipDto(String id, @NotBlank String label) {}

    public record ExperienceDto(
            String id,
            @NotBlank String company,
            @NotBlank String role,
            String duration,
            String description
    ) {}

    public record EducationDto(
            String id,
            @NotBlank String degree,
            @NotBlank String college,
            String year,
            String score
    ) {}

    public record CertificationDto(
            String id,
            @NotBlank String name,
            @NotBlank String org,
            String date,
            String url
    ) {}

    public record AchievementDto(
            String id,
            @NotBlank String title,
            String type,
            String year
    ) {}

    public static class SkillsDto {
        public List<ChipDto> languages = new ArrayList<>();
        public List<ChipDto> langs = new ArrayList<>();
        public List<ChipDto> frameworks = new ArrayList<>();
        public List<ChipDto> databases = new ArrayList<>();
        public List<ChipDto> cloud = new ArrayList<>();
        public List<ChipDto> devops = new ArrayList<>();
        public List<ChipDto> aiSkills = new ArrayList<>();
        public List<ChipDto> soft = new ArrayList<>();
    }

    public static class ProfilePayload {
        public String avatar;
        @NotBlank public String fullName;
        public String username;
        @Email public String email;
        public String phone;
        public String dob;
        public String gender;
        public String city;
        public String stateName;
        public String country;
        public String address;
        public List<ChipDto> languages = new ArrayList<>();
        public String college;
        public String university;
        public String department;
        public String branch;
        public String semester;
        public String usn;
        public String gradYear;
        public String cgpa;
        public String backlogs;
        public String objective;
        public String about;
        public String portfolio;
        public String github;
        public String linkedin;
        public String leetcode;
        public String hackerrank;
        public String codechef;
        public String codeforces;
        public String kaggle;
        public List<ChipDto> langs = new ArrayList<>();
        public List<ChipDto> frameworks = new ArrayList<>();
        public List<ChipDto> databases = new ArrayList<>();
        public List<ChipDto> cloud = new ArrayList<>();
        public List<ChipDto> devops = new ArrayList<>();
        public List<ChipDto> aiSkills = new ArrayList<>();
        public List<ChipDto> soft = new ArrayList<>();
        public List<ExperienceDto> experience = new ArrayList<>();
        public List<EducationDto> education = new ArrayList<>();
        public List<CertificationDto> certs = new ArrayList<>();
        public List<AchievementDto> achievements = new ArrayList<>();
        public Boolean darkMode;
        public Boolean notifications;
        public Boolean emailPrefs;
        public Boolean publicProfile;
        public Boolean placementVisible;
    }

    public static class ProfileResponse extends ProfilePayload {
        public int completionPercent;
        public List<String> missing = new ArrayList<>();
    }

    public record CompletionResponse(int percent, List<String> missing) {}

    public record RegisterRequest(
            @NotBlank String firstName,
            @NotBlank String lastName,
            @Email @NotBlank String email,
            @Size(min = 8, message = "Password must be at least 8 characters") String password,
            String college,
            String branchYear
    ) {}

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

    public record AuthResponse(String token, String email, String fullName) {}

    public record ImageUploadResponse(String avatarUrl) {}

    public record ApiError(String error, String message, Object details) {}
}
