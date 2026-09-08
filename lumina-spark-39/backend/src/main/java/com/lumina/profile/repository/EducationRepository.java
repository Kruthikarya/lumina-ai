package com.lumina.profile.repository;

import com.lumina.profile.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EducationRepository extends JpaRepository<Education, String> {
    List<Education> findByProfileId(Long profileId);

    Optional<Education> findByIdAndProfileStudentId(String id, Long studentId);
}
