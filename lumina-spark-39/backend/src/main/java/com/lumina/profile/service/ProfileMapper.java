package com.lumina.profile.service;

import com.lumina.profile.dto.AchievementDto;
import com.lumina.profile.dto.CertificationDto;
import com.lumina.profile.dto.ChipDto;
import com.lumina.profile.dto.EducationDto;
import com.lumina.profile.dto.ExperienceDto;
import com.lumina.profile.dto.ProfileDto;
import com.lumina.profile.entity.Achievement;
import com.lumina.profile.entity.Certification;
import com.lumina.profile.entity.Education;
import com.lumina.profile.entity.Experience;
import com.lumina.profile.entity.Skill;
import com.lumina.profile.entity.SkillCategory;
import com.lumina.profile.entity.StudentProfile;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Component
public class ProfileMapper {

    public ProfileDto toDto(StudentProfile p) {
        ProfileDto dto = new ProfileDto();
        dto.setAvatar(resolveAvatar(p));
        dto.setFullName(p.getFullName());
        dto.setUsername(p.getUsername());
        dto.setEmail(p.getEmail());
        dto.setPhone(p.getPhone());
        dto.setDob(p.getDob());
        dto.setGender(p.getGender());
        dto.setCity(p.getCity());
        dto.setStateName(p.getStateName());
        dto.setCountry(p.getCountry());
        dto.setAddress(p.getAddress());
        dto.setLanguages(chips(p, SkillCategory.LANGUAGES));
        dto.setCollege(p.getCollege());
        dto.setUniversity(p.getUniversity());
        dto.setDepartment(p.getDepartment());
        dto.setBranch(p.getBranch());
        dto.setSemester(p.getSemester());
        dto.setUsn(p.getUsn());
        dto.setGradYear(p.getGradYear());
        dto.setCgpa(p.getCgpa());
        dto.setBacklogs(p.getBacklogs());
        dto.setObjective(p.getObjective());
        dto.setAbout(p.getAbout());
        dto.setPortfolio(p.getPortfolio());
        dto.setGithub(p.getGithub());
        dto.setLinkedin(p.getLinkedin());
        dto.setLeetcode(p.getLeetcode());
        dto.setHackerrank(p.getHackerrank());
        dto.setCodechef(p.getCodechef());
        dto.setCodeforces(p.getCodeforces());
        dto.setKaggle(p.getKaggle());
        dto.setLangs(chips(p, SkillCategory.LANGS));
        dto.setFrameworks(chips(p, SkillCategory.FRAMEWORKS));
        dto.setDatabases(chips(p, SkillCategory.DATABASES));
        dto.setCloud(chips(p, SkillCategory.CLOUD));
        dto.setDevops(chips(p, SkillCategory.DEVOPS));
        dto.setAiSkills(chips(p, SkillCategory.AI_SKILLS));
        dto.setSoft(chips(p, SkillCategory.SOFT));
        dto.setExperience(p.getExperience().stream().map(this::toExperience).toList());
        dto.setEducation(p.getEducation().stream().map(this::toEducation).toList());
        dto.setCerts(p.getCertifications().stream().map(this::toCert).toList());
        dto.setAchievements(p.getAchievements().stream().map(this::toAchievement).toList());
        dto.setDarkMode(p.isDarkMode());
        dto.setNotifications(p.isNotifications());
        dto.setEmailPrefs(p.isEmailPrefs());
        dto.setPublicProfile(p.isPublicProfile());
        dto.setPlacementVisible(p.isPlacementVisible());
        dto.setCompletion(ProfileCompletionCalculator.calculate(dto));
        return dto;
    }

    public void applyScalars(StudentProfile p, ProfileDto d) {
        applyAvatarPayload(p, d.getAvatar());
        p.setFullName(d.getFullName());
        p.setUsername(n(d.getUsername()));
        p.setEmail(n(d.getEmail()));
        p.setPhone(n(d.getPhone()));
        p.setDob(n(d.getDob()));
        p.setGender(n(d.getGender()));
        p.setCity(n(d.getCity()));
        p.setStateName(n(d.getStateName()));
        p.setCountry(n(d.getCountry()));
        p.setAddress(n(d.getAddress()));
        p.setCollege(n(d.getCollege()));
        p.setUniversity(n(d.getUniversity()));
        p.setDepartment(n(d.getDepartment()));
        p.setBranch(n(d.getBranch()));
        p.setSemester(n(d.getSemester()));
        p.setUsn(n(d.getUsn()));
        p.setGradYear(n(d.getGradYear()));
        p.setCgpa(n(d.getCgpa()));
        p.setBacklogs(n(d.getBacklogs()));
        p.setObjective(n(d.getObjective()));
        p.setAbout(n(d.getAbout()));
        p.setPortfolio(n(d.getPortfolio()));
        p.setGithub(n(d.getGithub()));
        p.setLinkedin(n(d.getLinkedin()));
        p.setLeetcode(n(d.getLeetcode()));
        p.setHackerrank(n(d.getHackerrank()));
        p.setCodechef(n(d.getCodechef()));
        p.setCodeforces(n(d.getCodeforces()));
        p.setKaggle(n(d.getKaggle()));
        p.setDarkMode(d.isDarkMode());
        p.setNotifications(d.isNotifications());
        p.setEmailPrefs(d.isEmailPrefs());
        p.setPublicProfile(d.isPublicProfile());
        p.setPlacementVisible(d.isPlacementVisible());
    }

    public void replaceSkills(StudentProfile p, ProfileDto d) {
        p.getSkills().clear();
        addSkills(p, SkillCategory.LANGUAGES, d.getLanguages());
        addSkills(p, SkillCategory.LANGS, d.getLangs());
        addSkills(p, SkillCategory.FRAMEWORKS, d.getFrameworks());
        addSkills(p, SkillCategory.DATABASES, d.getDatabases());
        addSkills(p, SkillCategory.CLOUD, d.getCloud());
        addSkills(p, SkillCategory.DEVOPS, d.getDevops());
        addSkills(p, SkillCategory.AI_SKILLS, d.getAiSkills());
        addSkills(p, SkillCategory.SOFT, d.getSoft());
    }

    public void replaceEducation(StudentProfile p, List<EducationDto> items) {
        p.getEducation().clear();
        if (items == null) return;
        for (EducationDto dto : items) {
            p.getEducation().add(toEducationEntity(p, dto));
        }
    }

    public void replaceExperience(StudentProfile p, List<ExperienceDto> items) {
        p.getExperience().clear();
        if (items == null) return;
        for (ExperienceDto dto : items) {
            p.getExperience().add(toExperienceEntity(p, dto));
        }
    }

    public void replaceCerts(StudentProfile p, List<CertificationDto> items) {
        p.getCertifications().clear();
        if (items == null) return;
        for (CertificationDto dto : items) {
            p.getCertifications().add(toCertEntity(p, dto));
        }
    }

    public void replaceAchievements(StudentProfile p, List<AchievementDto> items) {
        p.getAchievements().clear();
        if (items == null) return;
        for (AchievementDto dto : items) {
            p.getAchievements().add(toAchievementEntity(p, dto));
        }
    }

    public Education toEducationEntity(StudentProfile p, EducationDto dto) {
        Education e = new Education();
        e.setId(idOrNew(dto.id()));
        e.setProfile(p);
        e.setDegree(dto.degree());
        e.setCollege(dto.college());
        e.setYear(n(dto.year()));
        e.setScore(n(dto.score()));
        return e;
    }

    public Experience toExperienceEntity(StudentProfile p, ExperienceDto dto) {
        Experience e = new Experience();
        e.setId(idOrNew(dto.id()));
        e.setProfile(p);
        e.setCompany(dto.company());
        e.setRole(dto.role());
        e.setDuration(n(dto.duration()));
        e.setDescription(n(dto.description()));
        return e;
    }

    public Certification toCertEntity(StudentProfile p, CertificationDto dto) {
        Certification c = new Certification();
        c.setId(idOrNew(dto.id()));
        c.setProfile(p);
        c.setName(dto.name());
        c.setOrg(dto.org());
        c.setDate(n(dto.date()));
        c.setUrl(n(dto.url()));
        return c;
    }

    public Achievement toAchievementEntity(StudentProfile p, AchievementDto dto) {
        Achievement a = new Achievement();
        a.setId(idOrNew(dto.id()));
        a.setProfile(p);
        a.setTitle(dto.title());
        a.setType(n(dto.type()));
        a.setYear(n(dto.year()));
        return a;
    }

    public Skill toSkillEntity(StudentProfile p, SkillCategory category, String label, String id) {
        Skill s = new Skill();
        s.setId(idOrNew(id));
        s.setProfile(p);
        s.setCategory(category);
        s.setLabel(label);
        return s;
    }

    public EducationDto toEducation(Education e) {
        return new EducationDto(e.getId(), e.getDegree(), e.getCollege(), e.getYear(), e.getScore());
    }

    public ExperienceDto toExperience(Experience e) {
        return new ExperienceDto(e.getId(), e.getCompany(), e.getRole(), e.getDuration(), e.getDescription());
    }

    public CertificationDto toCert(Certification c) {
        return new CertificationDto(c.getId(), c.getName(), c.getOrg(), c.getDate(), c.getUrl());
    }

    public AchievementDto toAchievement(Achievement a) {
        return new AchievementDto(a.getId(), a.getTitle(), a.getType(), a.getYear());
    }

    public ChipDto toChip(Skill s) {
        return new ChipDto(s.getId(), s.getLabel());
    }

    public void applyEducation(Education e, EducationDto dto) {
        e.setDegree(dto.degree());
        e.setCollege(dto.college());
        e.setYear(n(dto.year()));
        e.setScore(n(dto.score()));
    }

    public void applyExperience(Experience e, ExperienceDto dto) {
        e.setCompany(dto.company());
        e.setRole(dto.role());
        e.setDuration(n(dto.duration()));
        e.setDescription(n(dto.description()));
    }

    public void applyCert(Certification c, CertificationDto dto) {
        c.setName(dto.name());
        c.setOrg(dto.org());
        c.setDate(n(dto.date()));
        c.setUrl(n(dto.url()));
    }

    public void applyAchievement(Achievement a, AchievementDto dto) {
        a.setTitle(dto.title());
        a.setType(n(dto.type()));
        a.setYear(n(dto.year()));
    }

    private void addSkills(StudentProfile p, SkillCategory category, List<ChipDto> chips) {
        if (chips == null) return;
        for (ChipDto chip : chips) {
            if (chip == null || !StringUtils.hasText(chip.label())) continue;
            p.getSkills().add(toSkillEntity(p, category, chip.label().trim(), chip.id()));
        }
    }

    private List<ChipDto> chips(StudentProfile p, SkillCategory category) {
        return p.getSkills().stream()
                .filter(s -> s.getCategory() == category)
                .map(this::toChip)
                .toList();
    }

    public String resolveAvatar(StudentProfile p) {
        if (p.getAvatarBytes() != null && p.getAvatarBytes().length > 0) {
            return "/api/profile/avatar";
        }
        return p.getAvatar() == null ? "" : p.getAvatar();
    }

    private void applyAvatarPayload(StudentProfile p, String avatar) {
        if (avatar == null) {
            return;
        }
        if (avatar.startsWith("data:image")) {
            int comma = avatar.indexOf(',');
            if (comma > 0) {
                String meta = avatar.substring(5, comma);
                String contentType = meta.contains(";") ? meta.substring(0, meta.indexOf(';')) : "image/png";
                try {
                    byte[] bytes = Base64.getDecoder().decode(avatar.substring(comma + 1));
                    p.setAvatarBytes(bytes);
                    p.setAvatarContentType(contentType);
                    p.setAvatar("/api/profile/avatar");
                    return;
                } catch (IllegalArgumentException ignored) {
                    // fall through and store the string
                }
            }
        }
        if (avatar.equals("/api/profile/avatar") || avatar.contains("/api/profile/avatar")) {
            p.setAvatar("/api/profile/avatar");
            return;
        }
        p.setAvatar(avatar);
        if (avatar.isBlank()) {
            p.setAvatarBytes(null);
            p.setAvatarContentType(null);
        }
    }

    public static String idOrNew(String id) {
        return StringUtils.hasText(id) ? id : UUID.randomUUID().toString();
    }

    private static String n(String v) {
        return v == null ? "" : v;
    }
}
