package com.lumina.profile.repository;

import com.lumina.profile.entity.Skill;
import com.lumina.profile.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, String> {
    List<Skill> findByProfileId(Long profileId);

    List<Skill> findByProfileIdAndCategory(Long profileId, SkillCategory category);

    Optional<Skill> findByIdAndProfileStudentId(String id, Long studentId);
}
