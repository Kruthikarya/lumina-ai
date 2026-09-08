package com.lumina.profile.service;

import com.lumina.profile.dto.AchievementDto;
import com.lumina.profile.dto.CertificationDto;
import com.lumina.profile.dto.ChipDto;
import com.lumina.profile.dto.EducationDto;
import com.lumina.profile.dto.ExperienceDto;
import com.lumina.profile.dto.ProfileCompletionDto;
import com.lumina.profile.dto.ProfileDto;
import com.lumina.profile.dto.SkillRequest;
import com.lumina.profile.entity.Achievement;
import com.lumina.profile.entity.Certification;
import com.lumina.profile.entity.Education;
import com.lumina.profile.entity.Experience;
import com.lumina.profile.entity.Skill;
import com.lumina.profile.entity.SkillCategory;
import com.lumina.profile.entity.StudentProfile;
import com.lumina.profile.exception.BadRequestException;
import com.lumina.profile.exception.ResourceNotFoundException;
import com.lumina.profile.repository.AchievementRepository;
import com.lumina.profile.repository.CertificationRepository;
import com.lumina.profile.repository.EducationRepository;
import com.lumina.profile.repository.ExperienceRepository;
import com.lumina.profile.repository.SkillRepository;
import com.lumina.profile.repository.StudentProfileRepository;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
public class ProfileService {

    private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/jpg", "image/png", "image/webp");

    private final StudentProfileRepository profiles;
    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final CertificationRepository certificationRepository;
    private final AchievementRepository achievementRepository;
    private final SkillRepository skillRepository;
    private final ProfileMapper mapper;

    public ProfileService(
            StudentProfileRepository profiles,
            EducationRepository educationRepository,
            ExperienceRepository experienceRepository,
            CertificationRepository certificationRepository,
            AchievementRepository achievementRepository,
            SkillRepository skillRepository,
            ProfileMapper mapper
    ) {
        this.profiles = profiles;
        this.educationRepository = educationRepository;
        this.experienceRepository = experienceRepository;
        this.certificationRepository = certificationRepository;
        this.achievementRepository = achievementRepository;
        this.skillRepository = skillRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public ProfileDto get(Long studentId) {
        return mapper.toDto(load(studentId));
    }

    @Transactional
    public ProfileDto update(Long studentId, ProfileDto dto) {
        StudentProfile profile = load(studentId);
        mapper.applyScalars(profile, dto);
        mapper.replaceSkills(profile, dto);
        mapper.replaceEducation(profile, dto.getEducation());
        mapper.replaceExperience(profile, dto.getExperience());
        mapper.replaceCerts(profile, dto.getCerts());
        mapper.replaceAchievements(profile, dto.getAchievements());
        return mapper.toDto(profiles.save(profile));
    }

    @Transactional(readOnly = true)
    public ProfileCompletionDto completion(Long studentId) {
        return mapper.toDto(load(studentId)).getCompletion();
    }

    @Transactional
    public ProfileDto uploadAvatar(Long studentId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please choose an image file (PNG or JPG).");
        }
        String type = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
        if (!IMAGE_TYPES.contains(type) && !type.startsWith("image/")) {
            throw new BadRequestException("Please choose an image file (PNG or JPG).");
        }
        if (file.getSize() > 2L * 1024 * 1024) {
            throw new BadRequestException("Image is larger than 2MB. Please choose a smaller file.");
        }
        StudentProfile profile = load(studentId);
        try {
            profile.setAvatarBytes(file.getBytes());
            profile.setAvatarContentType(type.isBlank() ? MediaType.IMAGE_JPEG_VALUE : type);
            profile.setAvatar("/api/profile/avatar");
        } catch (IOException e) {
            throw new BadRequestException("Could not read that image. Please try again.");
        }
        return mapper.toDto(profiles.save(profile));
    }

    @Transactional(readOnly = true)
    public AvatarPayload avatar(Long studentId) {
        StudentProfile profile = load(studentId);
        if (profile.getAvatarBytes() == null || profile.getAvatarBytes().length == 0) {
            throw new ResourceNotFoundException("No profile photo uploaded");
        }
        String type = profile.getAvatarContentType() == null ? MediaType.IMAGE_JPEG_VALUE : profile.getAvatarContentType();
        return new AvatarPayload(profile.getAvatarBytes(), type);
    }

    @Transactional(readOnly = true)
    public List<EducationDto> listEducation(Long studentId) {
        return load(studentId).getEducation().stream().map(mapper::toEducation).toList();
    }

    @Transactional
    public EducationDto addEducation(Long studentId, EducationDto dto) {
        StudentProfile profile = load(studentId);
        Education entity = mapper.toEducationEntity(profile, dto);
        profile.getEducation().add(entity);
        return mapper.toEducation(educationRepository.save(entity));
    }

    @Transactional
    public EducationDto updateEducation(Long studentId, String id, EducationDto dto) {
        Education entity = educationRepository.findByIdAndProfileStudentId(id, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found"));
        mapper.applyEducation(entity, dto);
        return mapper.toEducation(educationRepository.save(entity));
    }

    @Transactional
    public void deleteEducation(Long studentId, String id) {
        Education entity = educationRepository.findByIdAndProfileStudentId(id, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found"));
        educationRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public List<ExperienceDto> listExperience(Long studentId) {
        return load(studentId).getExperience().stream().map(mapper::toExperience).toList();
    }

    @Transactional
    public ExperienceDto addExperience(Long studentId, ExperienceDto dto) {
        StudentProfile profile = load(studentId);
        Experience entity = mapper.toExperienceEntity(profile, dto);
        profile.getExperience().add(entity);
        return mapper.toExperience(experienceRepository.save(entity));
    }

    @Transactional
    public ExperienceDto updateExperience(Long studentId, String id, ExperienceDto dto) {
        Experience entity = experienceRepository.findByIdAndProfileStudentId(id, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));
        mapper.applyExperience(entity, dto);
        return mapper.toExperience(experienceRepository.save(entity));
    }

    @Transactional
    public void deleteExperience(Long studentId, String id) {
        Experience entity = experienceRepository.findByIdAndProfileStudentId(id, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));
        experienceRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public List<CertificationDto> listCerts(Long studentId) {
        return load(studentId).getCertifications().stream().map(mapper::toCert).toList();
    }

    @Transactional
    public CertificationDto addCert(Long studentId, CertificationDto dto) {
        StudentProfile profile = load(studentId);
        Certification entity = mapper.toCertEntity(profile, dto);
        profile.getCertifications().add(entity);
        return mapper.toCert(certificationRepository.save(entity));
    }

    @Transactional
    public CertificationDto updateCert(Long studentId, String id, CertificationDto dto) {
        Certification entity = certificationRepository.findByIdAndProfileStudentId(id, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found"));
        mapper.applyCert(entity, dto);
        return mapper.toCert(certificationRepository.save(entity));
    }

    @Transactional
    public void deleteCert(Long studentId, String id) {
        Certification entity = certificationRepository.findByIdAndProfileStudentId(id, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found"));
        certificationRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public List<AchievementDto> listAchievements(Long studentId) {
        return load(studentId).getAchievements().stream().map(mapper::toAchievement).toList();
    }

    @Transactional
    public AchievementDto addAchievement(Long studentId, AchievementDto dto) {
        StudentProfile profile = load(studentId);
        Achievement entity = mapper.toAchievementEntity(profile, dto);
        profile.getAchievements().add(entity);
        return mapper.toAchievement(achievementRepository.save(entity));
    }

    @Transactional
    public AchievementDto updateAchievement(Long studentId, String id, AchievementDto dto) {
        Achievement entity = achievementRepository.findByIdAndProfileStudentId(id, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found"));
        mapper.applyAchievement(entity, dto);
        return mapper.toAchievement(achievementRepository.save(entity));
    }

    @Transactional
    public void deleteAchievement(Long studentId, String id) {
        Achievement entity = achievementRepository.findByIdAndProfileStudentId(id, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found"));
        achievementRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public List<ChipDto> listSkills(Long studentId, SkillCategory category) {
        StudentProfile profile = load(studentId);
        return profile.getSkills().stream()
                .filter(s -> category == null || s.getCategory() == category)
                .map(mapper::toChip)
                .toList();
    }

    @Transactional
    public ChipDto addSkill(Long studentId, SkillRequest request) {
        StudentProfile profile = load(studentId);
        Skill skill = mapper.toSkillEntity(profile, request.category(), request.label().trim(), null);
        profile.getSkills().add(skill);
        return mapper.toChip(skillRepository.save(skill));
    }

    @Transactional
    public void deleteSkill(Long studentId, String id) {
        Skill skill = skillRepository.findByIdAndProfileStudentId(id, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        skillRepository.delete(skill);
    }

    private StudentProfile load(Long studentId) {
        StudentProfile profile = profiles.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        profile.getSkills().size();
        profile.getEducation().size();
        profile.getExperience().size();
        profile.getCertifications().size();
        profile.getAchievements().size();
        return profile;
    }

    public record AvatarPayload(byte[] bytes, String contentType) {}
}
