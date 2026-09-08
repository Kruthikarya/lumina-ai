package com.lumina.profile.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfileSkillRepository extends JpaRepository<ProfileSkill, String> {
    List<ProfileSkill> findByProfileIdOrderBySortOrderAsc(String profileId);
    void deleteByProfileId(String profileId);
}
