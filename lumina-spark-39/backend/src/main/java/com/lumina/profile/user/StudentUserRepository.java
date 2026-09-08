package com.lumina.profile.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentUserRepository extends JpaRepository<StudentUser, String> {
    Optional<StudentUser> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
