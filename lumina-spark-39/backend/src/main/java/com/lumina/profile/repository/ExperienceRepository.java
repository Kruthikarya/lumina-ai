package com.lumina.profile.repository;

import com.lumina.profile.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExperienceRepository extends JpaRepository<Experience, String> {
    List<Experience> findByProfileId(Long profileId);

    Optional<Experience> findByIdAndProfileStudentId(String id, Long studentId);
}
