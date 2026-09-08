package com.lumina.profile.controller;

import com.lumina.profile.dto.CertificationDto;
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
@RequestMapping("/api/profile/certifications")
public class CertificationController {

    private final ProfileService profiles;
    private final CurrentUser currentUser;

    public CertificationController(ProfileService profiles, CurrentUser currentUser) {
        this.profiles = profiles;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<CertificationDto> list() {
        return profiles.listCerts(currentUser.requireStudentId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CertificationDto create(@Valid @RequestBody CertificationDto dto) {
        return profiles.addCert(currentUser.requireStudentId(), dto);
    }

    @PutMapping("/{id}")
    public CertificationDto update(@PathVariable String id, @Valid @RequestBody CertificationDto dto) {
        return profiles.updateCert(currentUser.requireStudentId(), id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        profiles.deleteCert(currentUser.requireStudentId(), id);
    }
}
