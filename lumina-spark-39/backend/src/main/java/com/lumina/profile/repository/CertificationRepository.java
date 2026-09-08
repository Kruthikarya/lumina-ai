package com.lumina.profile.repository;

import com.lumina.profile.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, String> {
    List<Certification> findByProfileId(Long profileId);

    Optional<Certification> findByIdAndProfileStudentId(String id, Long studentId);
}
