package com.lumina.profile.profile;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;

@RestController
@RequestMapping("/api/public/profile-images")
public class ProfileImageController {

    private final StudentProfileService service;

    public ProfileImageController(StudentProfileService service) {
        this.service = service;
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> get(@PathVariable String filename) {
        Path file = service.resolvePublicImage(filename);
        MediaType type = MediaType.IMAGE_JPEG;
        String name = filename.toLowerCase();
        if (name.endsWith(".png")) type = MediaType.IMAGE_PNG;
        else if (name.endsWith(".webp")) type = MediaType.parseMediaType("image/webp");
        else if (name.endsWith(".gif")) type = MediaType.IMAGE_GIF;
        return ResponseEntity.ok().contentType(type).body(new FileSystemResource(file));
    }
}
