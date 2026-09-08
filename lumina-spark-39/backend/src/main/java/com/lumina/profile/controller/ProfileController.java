package com.lumina.profile.controller;

import com.lumina.profile.dto.ChipDto;
import com.lumina.profile.dto.ProfileCompletionDto;
import com.lumina.profile.dto.ProfileDto;
import com.lumina.profile.dto.SkillRequest;
import com.lumina.profile.entity.SkillCategory;
import com.lumina.profile.security.CurrentUser;
import com.lumina.profile.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profiles;
    private final CurrentUser currentUser;

    public ProfileController(ProfileService profiles, CurrentUser currentUser) {
        this.profiles = profiles;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ProfileDto get() {
        return profiles.get(currentUser.requireStudentId());
    }

    @PutMapping
    public ProfileDto update(@Valid @RequestBody ProfileDto dto) {
        return profiles.update(currentUser.requireStudentId(), dto);
    }

    @GetMapping("/completion")
    public ProfileCompletionDto completion() {
        return profiles.completion(currentUser.requireStudentId());
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProfileDto uploadAvatar(@RequestParam("file") MultipartFile file) {
        return profiles.uploadAvatar(currentUser.requireStudentId(), file);
    }

    @GetMapping("/avatar")
    public ResponseEntity<byte[]> avatar() {
        ProfileService.AvatarPayload payload = profiles.avatar(currentUser.requireStudentId());
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "private, max-age=60")
                .contentType(MediaType.parseMediaType(payload.contentType()))
                .body(payload.bytes());
    }

    @GetMapping("/skills")
    public List<ChipDto> skills(@RequestParam(required = false) SkillCategory category) {
        return profiles.listSkills(currentUser.requireStudentId(), category);
    }

    @PostMapping("/skills")
    public ChipDto addSkill(@Valid @RequestBody SkillRequest request) {
        return profiles.addSkill(currentUser.requireStudentId(), request);
    }

    @DeleteMapping("/skills/{id}")
    public void deleteSkill(@PathVariable String id) {
        profiles.deleteSkill(currentUser.requireStudentId(), id);
    }
}
