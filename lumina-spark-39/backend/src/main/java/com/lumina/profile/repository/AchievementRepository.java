package com.lumina.profile.repository;

import com.lumina.profile.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AchievementRepository extends JpaRepository<Achievement, String> {
    List<Achievement> findByProfileId(Long profileId);

    Optional<Achievement> findByIdAndProfileStudentId(String id, Long studentId);
}
