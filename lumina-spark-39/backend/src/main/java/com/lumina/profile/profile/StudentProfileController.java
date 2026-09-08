package com.lumina.profile.profile;

import com.lumina.profile.dto.ProfileDtos.AchievementDto;
import com.lumina.profile.dto.ProfileDtos.CertificationDto;
import com.lumina.profile.dto.ProfileDtos.CompletionResponse;
import com.lumina.profile.dto.ProfileDtos.EducationDto;
import com.lumina.profile.dto.ProfileDtos.ExperienceDto;
import com.lumina.profile.dto.ProfileDtos.ImageUploadResponse;
import com.lumina.profile.dto.ProfileDtos.ProfilePayload;
import com.lumina.profile.dto.ProfileDtos.ProfileResponse;
import com.lumina.profile.dto.ProfileDtos.SkillsDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/student/profile")
public class StudentProfileController {

    private final StudentProfileService service;

    public StudentProfileController(StudentProfileService service) {
        this.service = service;
    }

    @GetMapping
    public ProfileResponse get() {
        return service.getMine();
    }

    @PutMapping
    public ProfileResponse update(@Valid @RequestBody ProfilePayload payload) {
        return service.updateMine(payload);
    }

    @GetMapping("/completion")
    public CompletionResponse completion() {
        return service.completion();
    }

    @PostMapping("/image")
    public ImageUploadResponse upload(@RequestPart("file") MultipartFile file) {
        return service.uploadImage(file);
    }

    @GetMapping("/skills")
    public SkillsDto skills() {
        return service.getSkills();
    }

    @PutMapping("/skills")
    public SkillsDto updateSkills(@RequestBody SkillsDto skills) {
        return service.updateSkills(skills);
    }

    @GetMapping("/education")
    public List<EducationDto> education() {
        return service.listEducation();
    }

    @PostMapping("/education")
    @ResponseStatus(HttpStatus.CREATED)
    public EducationDto createEducation(@Valid @RequestBody EducationDto dto) {
        return service.createEducation(dto);
    }

    @PutMapping("/education/{id}")
    public EducationDto updateEducation(@PathVariable String id, @Valid @RequestBody EducationDto dto) {
        return service.updateEducation(id, dto);
    }

    @DeleteMapping("/education/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEducation(@PathVariable String id) {
        service.deleteEducation(id);
    }

    @GetMapping("/experience")
    public List<ExperienceDto> experience() {
        return service.listExperience();
    }

    @PostMapping("/experience")
    @ResponseStatus(HttpStatus.CREATED)
    public ExperienceDto createExperience(@Valid @RequestBody ExperienceDto dto) {
        return service.createExperience(dto);
    }

    @PutMapping("/experience/{id}")
    public ExperienceDto updateExperience(@PathVariable String id, @Valid @RequestBody ExperienceDto dto) {
        return service.updateExperience(id, dto);
    }

    @DeleteMapping("/experience/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExperience(@PathVariable String id) {
        service.deleteExperience(id);
    }

    @GetMapping("/certifications")
    public List<CertificationDto> certs() {
        return service.listCerts();
    }

    @PostMapping("/certifications")
    @ResponseStatus(HttpStatus.CREATED)
    public CertificationDto createCert(@Valid @RequestBody CertificationDto dto) {
        return service.createCert(dto);
    }

    @PutMapping("/certifications/{id}")
    public CertificationDto updateCert(@PathVariable String id, @Valid @RequestBody CertificationDto dto) {
        return service.updateCert(id, dto);
    }

    @DeleteMapping("/certifications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCert(@PathVariable String id) {
        service.deleteCert(id);
    }

    @GetMapping("/achievements")
    public List<AchievementDto> achievements() {
        return service.listAchievements();
    }

    @PostMapping("/achievements")
    @ResponseStatus(HttpStatus.CREATED)
    public AchievementDto createAchievement(@Valid @RequestBody AchievementDto dto) {
        return service.createAchievement(dto);
    }

    @PutMapping("/achievements/{id}")
    public AchievementDto updateAchievement(@PathVariable String id, @Valid @RequestBody AchievementDto dto) {
        return service.updateAchievement(id, dto);
    }

    @DeleteMapping("/achievements/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAchievement(@PathVariable String id) {
        service.deleteAchievement(id);
    }
}
