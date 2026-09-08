package com.lumina.profile.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, String> {
    List<Certification> findByProfileIdOrderBySortOrderAsc(String profileId);
    Optional<Certification> findByIdAndProfileId(String id, String profileId);
}
