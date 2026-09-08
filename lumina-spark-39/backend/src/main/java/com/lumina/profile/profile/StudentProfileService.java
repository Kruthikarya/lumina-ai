package com.lumina.profile.profile;

import com.lumina.profile.domain.Achievement;
import com.lumina.profile.domain.AchievementRepository;
import com.lumina.profile.domain.Certification;
import com.lumina.profile.domain.CertificationRepository;
import com.lumina.profile.domain.Education;
import com.lumina.profile.domain.EducationRepository;
import com.lumina.profile.domain.Experience;
import com.lumina.profile.domain.ExperienceRepository;
import com.lumina.profile.domain.StudentProfile;
import com.lumina.profile.domain.StudentProfileRepository;
import com.lumina.profile.dto.ProfileDtos.AchievementDto;
import com.lumina.profile.dto.ProfileDtos.CertificationDto;
import com.lumina.profile.dto.ProfileDtos.CompletionResponse;
import com.lumina.profile.dto.ProfileDtos.EducationDto;
import com.lumina.profile.dto.ProfileDtos.ExperienceDto;
import com.lumina.profile.dto.ProfileDtos.ImageUploadResponse;
import com.lumina.profile.dto.ProfileDtos.ProfilePayload;
import com.lumina.profile.dto.ProfileDtos.ProfileResponse;
import com.lumina.profile.dto.ProfileDtos.SkillsDto;
import com.lumina.profile.exception.BadRequestException;
import com.lumina.profile.exception.NotFoundException;
import com.lumina.profile.security.CurrentUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class StudentProfileService {

    private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif");

    private final StudentProfileRepository profiles;
    private final EducationRepository educationRepo;
    private final ExperienceRepository experienceRepo;
    private final CertificationRepository certRepo;
    private final AchievementRepository achievementRepo;
    private final CurrentUser currentUser;
    private final Path uploadDir;

    public StudentProfileService(
            StudentProfileRepository profiles,
            EducationRepository educationRepo,
            ExperienceRepository experienceRepo,
            CertificationRepository certRepo,
            AchievementRepository achievementRepo,
            CurrentUser currentUser,
            @Value("${app.uploads.dir}") String uploadDir
    ) {
        this.profiles = profiles;
        this.educationRepo = educationRepo;
        this.experienceRepo = experienceRepo;
        this.certRepo = certRepo;
        this.achievementRepo = achievementRepo;
        this.currentUser = currentUser;
        this.uploadDir = Path.of(uploadDir);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getMine() {
        return ProfileMapper.toResponse(owned());
    }

    @Transactional
    public ProfileResponse updateMine(ProfilePayload payload) {
        StudentProfile p = owned();
        ProfileMapper.applyScalars(p, payload);
        ProfileMapper.replaceSkillsFromPayload(p, payload);
        ProfileMapper.replaceCollections(p, payload);
        return ProfileMapper.toResponse(profiles.save(p));
    }

    @Transactional(readOnly = true)
    public CompletionResponse completion() {
        return ProfileMapper.completion(ProfileMapper.toResponse(owned()));
    }

    @Transactional(readOnly = true)
    public SkillsDto getSkills() {
        return ProfileMapper.toSkills(owned());
    }

    @Transactional
    public SkillsDto updateSkills(SkillsDto skills) {
        StudentProfile p = owned();
        ProfileMapper.replaceSkills(p, skills);
        return ProfileMapper.toSkills(profiles.save(p));
    }

    @Transactional
    public ImageUploadResponse uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BadRequestException("Please choose an image file (PNG or JPG).");
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        if (!IMAGE_TYPES.contains(contentType) && !contentType.startsWith("image/")) {
            throw new BadRequestException("Please choose an image file (PNG or JPG).");
        }
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new BadRequestException("Image is larger than 2MB. Please choose a smaller file.");
        }
        try {
            Files.createDirectories(uploadDir);
            String ext = extension(file.getOriginalFilename(), contentType);
            String filename = currentUser.userId() + "-" + UUID.randomUUID() + ext;
            Path dest = uploadDir.resolve(filename).normalize();
            if (!dest.startsWith(uploadDir.toAbsolutePath().normalize()) && !dest.startsWith(uploadDir.normalize())) {
                throw new BadRequestException("Invalid upload path");
            }
            file.transferTo(dest.toFile());
            String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/public/profile-images/")
                    .path(filename)
                    .toUriString();
            StudentProfile p = owned();
            p.setAvatar(url);
            profiles.save(p);
            return new ImageUploadResponse(url);
        } catch (IOException ex) {
            throw new BadRequestException("Could not store image: " + ex.getMessage());
        }
    }

    public Path resolvePublicImage(String filename) {
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            throw new BadRequestException("Invalid filename");
        }
        Path file = uploadDir.resolve(filename).normalize();
        if (!Files.exists(file)) throw new NotFoundException("Image not found");
        return file;
    }

    @Transactional(readOnly = true)
    public List<EducationDto> listEducation() {
        return owned().getEducation().stream().map(ProfileMapper::toEdu).toList();
    }

    @Transactional
    public EducationDto createEducation(EducationDto dto) {
        StudentProfile p = owned();
        Education e = ProfileMapper.eduFrom(dto);
        e.setProfile(p);
        e.setSortOrder(p.getEducation().size());
        p.getEducation().add(e);
        profiles.save(p);
        return ProfileMapper.toEdu(e);
    }

    @Transactional
    public EducationDto updateEducation(String id, EducationDto dto) {
        Education e = educationRepo.findByIdAndProfileId(id, owned().getId())
                .orElseThrow(() -> new NotFoundException("Education not found"));
        e.setDegree(dto.degree());
        e.setCollege(dto.college());
        e.setYear(dto.year());
        e.setScore(dto.score());
        return ProfileMapper.toEdu(educationRepo.save(e));
    }

    @Transactional
    public void deleteEducation(String id) {
        Education e = educationRepo.findByIdAndProfileId(id, owned().getId())
                .orElseThrow(() -> new NotFoundException("Education not found"));
        educationRepo.delete(e);
    }

    @Transactional(readOnly = true)
    public List<ExperienceDto> listExperience() {
        return owned().getExperience().stream().map(ProfileMapper::toExp).toList();
    }

    @Transactional
    public ExperienceDto createExperience(ExperienceDto dto) {
        StudentProfile p = owned();
        Experience e = ProfileMapper.expFrom(dto);
        e.setProfile(p);
        e.setSortOrder(p.getExperience().size());
        p.getExperience().add(e);
        profiles.save(p);
        return ProfileMapper.toExp(e);
    }

    @Transactional
    public ExperienceDto updateExperience(String id, ExperienceDto dto) {
        Experience e = experienceRepo.findByIdAndProfileId(id, owned().getId())
                .orElseThrow(() -> new NotFoundException("Experience not found"));
        e.setCompany(dto.company());
        e.setRole(dto.role());
        e.setDuration(dto.duration());
        e.setDescription(dto.description());
        return ProfileMapper.toExp(experienceRepo.save(e));
    }

    @Transactional
    public void deleteExperience(String id) {
        Experience e = experienceRepo.findByIdAndProfileId(id, owned().getId())
                .orElseThrow(() -> new NotFoundException("Experience not found"));
        experienceRepo.delete(e);
    }

    @Transactional(readOnly = true)
    public List<CertificationDto> listCerts() {
        return owned().getCertifications().stream().map(ProfileMapper::toCert).toList();
    }

    @Transactional
    public CertificationDto createCert(CertificationDto dto) {
        StudentProfile p = owned();
        Certification e = ProfileMapper.certFrom(dto);
        e.setProfile(p);
        e.setSortOrder(p.getCertifications().size());
        p.getCertifications().add(e);
        profiles.save(p);
        return ProfileMapper.toCert(e);
    }

    @Transactional
    public CertificationDto updateCert(String id, CertificationDto dto) {
        Certification e = certRepo.findByIdAndProfileId(id, owned().getId())
                .orElseThrow(() -> new NotFoundException("Certification not found"));
        e.setName(dto.name());
        e.setOrg(dto.org());
        e.setDate(dto.date());
        e.setUrl(dto.url());
        return ProfileMapper.toCert(certRepo.save(e));
    }

    @Transactional
    public void deleteCert(String id) {
        Certification e = certRepo.findByIdAndProfileId(id, owned().getId())
                .orElseThrow(() -> new NotFoundException("Certification not found"));
        certRepo.delete(e);
    }

    @Transactional(readOnly = true)
    public List<AchievementDto> listAchievements() {
        return owned().getAchievements().stream().map(ProfileMapper::toAch).toList();
    }

    @Transactional
    public AchievementDto createAchievement(AchievementDto dto) {
        StudentProfile p = owned();
        Achievement e = ProfileMapper.achFrom(dto);
        e.setProfile(p);
        e.setSortOrder(p.getAchievements().size());
        p.getAchievements().add(e);
        profiles.save(p);
        return ProfileMapper.toAch(e);
    }

    @Transactional
    public AchievementDto updateAchievement(String id, AchievementDto dto) {
        Achievement e = achievementRepo.findByIdAndProfileId(id, owned().getId())
                .orElseThrow(() -> new NotFoundException("Achievement not found"));
        e.setTitle(dto.title());
        e.setType(dto.type());
        e.setYear(dto.year());
        return ProfileMapper.toAch(achievementRepo.save(e));
    }

    @Transactional
    public void deleteAchievement(String id) {
        Achievement e = achievementRepo.findByIdAndProfileId(id, owned().getId())
                .orElseThrow(() -> new NotFoundException("Achievement not found"));
        achievementRepo.delete(e);
    }

    private StudentProfile owned() {
        return profiles.findByUserId(currentUser.userId())
                .orElseThrow(() -> new NotFoundException("Profile not found"));
    }

    private static String extension(String original, String contentType) {
        if (original != null && original.contains(".")) {
            String ext = original.substring(original.lastIndexOf('.')).toLowerCase(Locale.ROOT);
            if (ext.matches("\\.(png|jpe?g|gif|webp)")) return ext.equals(".jpeg") ? ".jpg" : ext;
        }
        if (contentType.contains("png")) return ".png";
        if (contentType.contains("webp")) return ".webp";
        if (contentType.contains("gif")) return ".gif";
        return ".jpg";
    }
}
