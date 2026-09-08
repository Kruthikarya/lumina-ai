package com.lumina.profile.profile;

import com.lumina.profile.domain.Achievement;
import com.lumina.profile.domain.Certification;
import com.lumina.profile.domain.Education;
import com.lumina.profile.domain.Experience;
import com.lumina.profile.domain.ProfileSkill;
import com.lumina.profile.domain.StudentProfile;
import com.lumina.profile.dto.ProfileDtos.AchievementDto;
import com.lumina.profile.dto.ProfileDtos.CertificationDto;
import com.lumina.profile.dto.ProfileDtos.ChipDto;
import com.lumina.profile.dto.ProfileDtos.CompletionResponse;
import com.lumina.profile.dto.ProfileDtos.EducationDto;
import com.lumina.profile.dto.ProfileDtos.ExperienceDto;
import com.lumina.profile.dto.ProfileDtos.ProfilePayload;
import com.lumina.profile.dto.ProfileDtos.ProfileResponse;
import com.lumina.profile.dto.ProfileDtos.SkillsDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.function.Function;

public final class ProfileMapper {

    public static final List<String> SKILL_GROUPS = List.of(
            "languages", "langs", "frameworks", "databases", "cloud", "devops", "aiSkills", "soft"
    );

    private ProfileMapper() {}

    public static ProfileResponse toResponse(StudentProfile p) {
        ProfileResponse r = new ProfileResponse();
        copyScalars(p, r);
        SkillsDto skills = toSkills(p);
        r.languages = skills.languages;
        r.langs = skills.langs;
        r.frameworks = skills.frameworks;
        r.databases = skills.databases;
        r.cloud = skills.cloud;
        r.devops = skills.devops;
        r.aiSkills = skills.aiSkills;
        r.soft = skills.soft;
        r.experience = p.getExperience().stream().map(ProfileMapper::toExp).toList();
        r.education = p.getEducation().stream().map(ProfileMapper::toEdu).toList();
        r.certs = p.getCertifications().stream().map(ProfileMapper::toCert).toList();
        r.achievements = p.getAchievements().stream().map(ProfileMapper::toAch).toList();
        CompletionResponse c = completion(r);
        r.completionPercent = c.percent();
        r.missing = c.missing();
        return r;
    }

    public static SkillsDto toSkills(StudentProfile p) {
        SkillsDto dto = new SkillsDto();
        for (ProfileSkill s : p.getSkills()) {
            ChipDto chip = new ChipDto(s.getId(), s.getLabel());
            switch (s.getCategory()) {
                case "languages" -> dto.languages.add(chip);
                case "langs" -> dto.langs.add(chip);
                case "frameworks" -> dto.frameworks.add(chip);
                case "databases" -> dto.databases.add(chip);
                case "cloud" -> dto.cloud.add(chip);
                case "devops" -> dto.devops.add(chip);
                case "aiSkills" -> dto.aiSkills.add(chip);
                case "soft" -> dto.soft.add(chip);
                default -> {}
            }
        }
        return dto;
    }

    public static void applyScalars(StudentProfile p, ProfilePayload in) {
        if (in.avatar != null) p.setAvatar(in.avatar);
        if (in.fullName != null) p.setFullName(in.fullName);
        p.setUsername(in.username);
        if (in.email != null) p.setEmail(in.email);
        p.setPhone(in.phone);
        p.setDob(in.dob);
        p.setGender(in.gender);
        p.setCity(in.city);
        p.setStateName(in.stateName);
        p.setCountry(in.country);
        p.setAddress(in.address);
        p.setCollege(in.college);
        p.setUniversity(in.university);
        p.setDepartment(in.department);
        p.setBranch(in.branch);
        p.setSemester(in.semester);
        p.setUsn(in.usn);
        p.setGradYear(in.gradYear);
        p.setCgpa(in.cgpa);
        p.setBacklogs(in.backlogs);
        p.setObjective(in.objective);
        p.setAbout(in.about);
        p.setPortfolio(in.portfolio);
        p.setGithub(in.github);
        p.setLinkedin(in.linkedin);
        p.setLeetcode(in.leetcode);
        p.setHackerrank(in.hackerrank);
        p.setCodechef(in.codechef);
        p.setCodeforces(in.codeforces);
        p.setKaggle(in.kaggle);
        if (in.darkMode != null) p.setDarkMode(in.darkMode);
        if (in.notifications != null) p.setNotifications(in.notifications);
        if (in.emailPrefs != null) p.setEmailPrefs(in.emailPrefs);
        if (in.publicProfile != null) p.setPublicProfile(in.publicProfile);
        if (in.placementVisible != null) p.setPlacementVisible(in.placementVisible);
    }

    public static void replaceSkills(StudentProfile p, SkillsDto skills) {
        p.getSkills().clear();
        addChips(p, "languages", skills.languages);
        addChips(p, "langs", skills.langs);
        addChips(p, "frameworks", skills.frameworks);
        addChips(p, "databases", skills.databases);
        addChips(p, "cloud", skills.cloud);
        addChips(p, "devops", skills.devops);
        addChips(p, "aiSkills", skills.aiSkills);
        addChips(p, "soft", skills.soft);
    }

    public static void replaceSkillsFromPayload(StudentProfile p, ProfilePayload in) {
        SkillsDto skills = new SkillsDto();
        skills.languages = nz(in.languages);
        skills.langs = nz(in.langs);
        skills.frameworks = nz(in.frameworks);
        skills.databases = nz(in.databases);
        skills.cloud = nz(in.cloud);
        skills.devops = nz(in.devops);
        skills.aiSkills = nz(in.aiSkills);
        skills.soft = nz(in.soft);
        replaceSkills(p, skills);
    }

    public static void replaceCollections(StudentProfile p, ProfilePayload in) {
        replaceList(p.getEducation(), nz(in.education), p, ProfileMapper::eduFrom);
        replaceList(p.getExperience(), nz(in.experience), p, ProfileMapper::expFrom);
        replaceList(p.getCertifications(), nz(in.certs), p, ProfileMapper::certFrom);
        replaceList(p.getAchievements(), nz(in.achievements), p, ProfileMapper::achFrom);
    }

    private static <E, D> void replaceList(List<E> target, List<D> src, StudentProfile p, Function<D, E> factory) {
        target.clear();
        int i = 0;
        for (D d : src) {
            E e = factory.apply(d);
            if (e instanceof Education edu) { edu.setProfile(p); edu.setSortOrder(i); }
            if (e instanceof Experience exp) { exp.setProfile(p); exp.setSortOrder(i); }
            if (e instanceof Certification c) { c.setProfile(p); c.setSortOrder(i); }
            if (e instanceof Achievement a) { a.setProfile(p); a.setSortOrder(i); }
            target.add(e);
            i++;
        }
    }

    private static void addChips(StudentProfile p, String category, List<ChipDto> chips) {
        int i = 0;
        for (ChipDto c : nz(chips)) {
            if (c == null || c.label() == null || c.label().isBlank()) continue;
            ProfileSkill s = new ProfileSkill();
            s.setId(safeId(c.id()));
            s.setProfile(p);
            s.setCategory(category);
            s.setLabel(c.label().trim());
            s.setSortOrder(i++);
            p.getSkills().add(s);
        }
    }

    public static Education eduFrom(EducationDto d) {
        Education e = new Education();
        e.setId(safeId(d.id()));
        e.setDegree(d.degree());
        e.setCollege(d.college());
        e.setYear(d.year());
        e.setScore(d.score());
        return e;
    }

    public static Experience expFrom(ExperienceDto d) {
        Experience e = new Experience();
        e.setId(safeId(d.id()));
        e.setCompany(d.company());
        e.setRole(d.role());
        e.setDuration(d.duration());
        e.setDescription(d.description());
        return e;
    }

    public static Certification certFrom(CertificationDto d) {
        Certification e = new Certification();
        e.setId(safeId(d.id()));
        e.setName(d.name());
        e.setOrg(d.org());
        e.setDate(d.date());
        e.setUrl(d.url());
        return e;
    }

    public static Achievement achFrom(AchievementDto d) {
        Achievement e = new Achievement();
        e.setId(safeId(d.id()));
        e.setTitle(d.title());
        e.setType(d.type());
        e.setYear(d.year());
        return e;
    }

    public static EducationDto toEdu(Education e) {
        return new EducationDto(e.getId(), n(e.getDegree()), n(e.getCollege()), n(e.getYear()), n(e.getScore()));
    }

    public static ExperienceDto toExp(Experience e) {
        return new ExperienceDto(e.getId(), n(e.getCompany()), n(e.getRole()), n(e.getDuration()), n(e.getDescription()));
    }

    public static CertificationDto toCert(Certification e) {
        return new CertificationDto(e.getId(), n(e.getName()), n(e.getOrg()), n(e.getDate()), n(e.getUrl()));
    }

    public static AchievementDto toAch(Achievement e) {
        return new AchievementDto(e.getId(), n(e.getTitle()), n(e.getType()), n(e.getYear()));
    }

    public static CompletionResponse completion(ProfilePayload d) {
        List<String> missing = new ArrayList<>();
        if (d.avatar == null || d.avatar.isBlank() || d.avatar.contains("pravatar")) {
            missing.add("Upload a real profile photo");
        }
        if (d.portfolio == null || d.portfolio.isBlank()) missing.add("Add your portfolio URL");
        if (d.certs == null || d.certs.isEmpty()) missing.add("Add at least one certification");
        if (d.experience == null || d.experience.isEmpty()) missing.add("Add work experience");

        long filled = List.of(d.fullName, d.email, d.phone, d.about, d.github, d.linkedin, d.portfolio, d.cgpa)
                .stream().filter(v -> v != null && !v.isBlank()).count();
        int skillGroups = 0;
        if (notEmpty(d.langs)) skillGroups++;
        if (notEmpty(d.frameworks)) skillGroups++;
        if (notEmpty(d.databases)) skillGroups++;
        if (notEmpty(d.cloud)) skillGroups++;
        if (notEmpty(d.aiSkills)) skillGroups++;
        int certBit = (d.certs != null && !d.certs.isEmpty()) ? 1 : 0;
        int expBit = (d.experience != null && !d.experience.isEmpty()) ? 1 : 0;
        int percent = (int) Math.min(100, Math.round((filled / 8.0) * 60 + (skillGroups / 5.0) * 25 + (certBit + expBit) * 7.5));
        if (missing.isEmpty()) missing = List.of("Your profile is looking great!");
        return new CompletionResponse(percent, missing);
    }

    public static String safeId(String id) {
        if (id == null || id.isBlank()) return UUID.randomUUID().toString();
        return id;
    }

    private static void copyScalars(StudentProfile p, ProfilePayload r) {
        r.avatar = n(p.getAvatar());
        r.fullName = n(p.getFullName());
        r.username = n(p.getUsername());
        r.email = n(p.getEmail());
        r.phone = n(p.getPhone());
        r.dob = n(p.getDob());
        r.gender = n(p.getGender());
        r.city = n(p.getCity());
        r.stateName = n(p.getStateName());
        r.country = n(p.getCountry());
        r.address = n(p.getAddress());
        r.college = n(p.getCollege());
        r.university = n(p.getUniversity());
        r.department = n(p.getDepartment());
        r.branch = n(p.getBranch());
        r.semester = n(p.getSemester());
        r.usn = n(p.getUsn());
        r.gradYear = n(p.getGradYear());
        r.cgpa = n(p.getCgpa());
        r.backlogs = n(p.getBacklogs());
        r.objective = n(p.getObjective());
        r.about = n(p.getAbout());
        r.portfolio = n(p.getPortfolio());
        r.github = n(p.getGithub());
        r.linkedin = n(p.getLinkedin());
        r.leetcode = n(p.getLeetcode());
        r.hackerrank = n(p.getHackerrank());
        r.codechef = n(p.getCodechef());
        r.codeforces = n(p.getCodeforces());
        r.kaggle = n(p.getKaggle());
        r.darkMode = p.isDarkMode();
        r.notifications = p.isNotifications();
        r.emailPrefs = p.isEmailPrefs();
        r.publicProfile = p.isPublicProfile();
        r.placementVisible = p.isPlacementVisible();
    }

    private static String n(String v) { return v == null ? "" : v; }
    private static <T> List<T> nz(List<T> v) { return v == null ? List.of() : v; }
    private static boolean notEmpty(List<?> v) { return v != null && !v.isEmpty(); }

    @SuppressWarnings("unused")
    private static <T> void unused(BiConsumer<T, T> c, Function<T, T> f, Objects o) {}
}
