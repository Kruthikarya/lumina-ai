package com.lumina.profile.repository;

import com.lumina.profile.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByStudentId(Long studentId);

    @Query("""
            select p from StudentProfile p
            left join fetch p.skills
            where p.student.id = :studentId
            """)
    Optional<StudentProfile> findWithSkillsByStudentId(@Param("studentId") Long studentId);
}
