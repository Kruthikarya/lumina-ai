package com.lumina.profile.service;

import com.lumina.profile.dto.ProfileCompletionDto;
import com.lumina.profile.dto.ProfileDto;

import java.util.ArrayList;
import java.util.List;

public final class ProfileCompletionCalculator {

    private ProfileCompletionCalculator() {}

    public static ProfileCompletionDto calculate(ProfileDto d) {
        List<String> missing = new ArrayList<>();
        String avatar = nz(d.getAvatar());
        if (avatar.isBlank() || avatar.contains("pravatar")) {
            missing.add("Upload a real profile photo");
        }
        if (nz(d.getPortfolio()).isBlank()) {
            missing.add("Add your portfolio URL");
        }
        if (d.getCerts() == null || d.getCerts().isEmpty()) {
            missing.add("Add at least one certification");
        }
        if (d.getExperience() == null || d.getExperience().isEmpty()) {
            missing.add("Add work experience");
        }

        int filled = (int) List.of(
                d.getFullName(), d.getEmail(), d.getPhone(), d.getAbout(),
                d.getGithub(), d.getLinkedin(), d.getPortfolio(), d.getCgpa()
        ).stream().filter(v -> v != null && !v.isBlank()).count();

        int skillGroups = 0;
        if (hasChips(d.getLangs())) skillGroups++;
        if (hasChips(d.getFrameworks())) skillGroups++;
        if (hasChips(d.getDatabases())) skillGroups++;
        if (hasChips(d.getCloud())) skillGroups++;
        if (hasChips(d.getAiSkills())) skillGroups++;

        int certBonus = (d.getCerts() != null && !d.getCerts().isEmpty()) ? 1 : 0;
        int expBonus = (d.getExperience() != null && !d.getExperience().isEmpty()) ? 1 : 0;
        int percent = Math.min(100, (int) Math.round((filled / 8.0) * 60 + (skillGroups / 5.0) * 25 + (certBonus + expBonus) * 7.5));

        if (missing.isEmpty()) {
            missing.add("Your profile is looking great!");
        }
        return new ProfileCompletionDto(percent, missing);
    }

    private static boolean hasChips(List<?> chips) {
        return chips != null && !chips.isEmpty();
    }

    private static String nz(String v) {
        return v == null ? "" : v;
    }
}
