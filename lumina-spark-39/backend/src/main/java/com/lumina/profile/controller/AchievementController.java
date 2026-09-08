package com.lumina.profile.controller;

import com.lumina.profile.dto.AchievementDto;
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
@RequestMapping("/api/profile/achievements")
public class AchievementController {

    private final ProfileService profiles;
    private final CurrentUser currentUser;

    public AchievementController(ProfileService profiles, CurrentUser currentUser) {
        this.profiles = profiles;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<AchievementDto> list() {
        return profiles.listAchievements(currentUser.requireStudentId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AchievementDto create(@Valid @RequestBody AchievementDto dto) {
        return profiles.addAchievement(currentUser.requireStudentId(), dto);
    }

    @PutMapping("/{id}")
    public AchievementDto update(@PathVariable String id, @Valid @RequestBody AchievementDto dto) {
        return profiles.updateAchievement(currentUser.requireStudentId(), id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        profiles.deleteAchievement(currentUser.requireStudentId(), id);
    }
}
