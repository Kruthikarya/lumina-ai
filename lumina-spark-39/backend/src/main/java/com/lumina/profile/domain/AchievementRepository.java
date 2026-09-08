package com.lumina.profile.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AchievementRepository extends JpaRepository<Achievement, String> {
    List<Achievement> findByProfileIdOrderBySortOrderAsc(String profileId);
    Optional<Achievement> findByIdAndProfileId(String id, String profileId);
}
