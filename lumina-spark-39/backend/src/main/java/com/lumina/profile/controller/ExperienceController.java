package com.lumina.profile.controller;

import com.lumina.profile.dto.ExperienceDto;
import com.lumina.profile.security.CurrentUser;
import com.lumina.profile.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/profile/experience")
public class ExperienceController {

    private final ProfileService profiles;
    private final CurrentUser currentUser;

    public ExperienceController(ProfileService profiles, CurrentUser currentUser) {
        this.profiles = profiles;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<ExperienceDto> list() {
        return profiles.listExperience(currentUser.requireStudentId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExperienceDto create(@Valid @RequestBody ExperienceDto dto) {
        return profiles.addExperience(currentUser.requireStudentId(), dto);
    }

    @PutMapping("/{id}")
    public ExperienceDto update(@PathVariable String id, @Valid @RequestBody ExperienceDto dto) {
        return profiles.updateExperience(currentUser.requireStudentId(), id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        profiles.deleteExperience(currentUser.requireStudentId(), id);
    }
}
