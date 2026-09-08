package com.lumina.profile.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExperienceRepository extends JpaRepository<Experience, String> {
    List<Experience> findByProfileIdOrderBySortOrderAsc(String profileId);
    Optional<Experience> findByIdAndProfileId(String id, String profileId);
}
