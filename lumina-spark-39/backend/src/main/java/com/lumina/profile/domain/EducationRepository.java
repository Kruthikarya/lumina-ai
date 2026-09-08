package com.lumina.profile.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EducationRepository extends JpaRepository<Education, String> {
    List<Education> findByProfileIdOrderBySortOrderAsc(String profileId);
    Optional<Education> findByIdAndProfileId(String id, String profileId);
}
