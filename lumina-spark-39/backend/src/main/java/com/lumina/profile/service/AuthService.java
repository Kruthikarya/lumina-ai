package com.lumina.profile.service;

import com.lumina.profile.dto.AuthResponse;
import com.lumina.profile.dto.LoginRequest;
import com.lumina.profile.dto.RegisterRequest;
import com.lumina.profile.entity.Student;
import com.lumina.profile.entity.StudentProfile;
import com.lumina.profile.exception.ConflictException;
import com.lumina.profile.repository.StudentProfileRepository;
import com.lumina.profile.repository.StudentRepository;
import com.lumina.profile.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final StudentRepository students;
    private final StudentProfileRepository profiles;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(
            StudentRepository students,
            StudentProfileRepository profiles,
            PasswordEncoder encoder,
            JwtService jwtService
    ) {
        this.students = students;
        this.profiles = profiles;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (students.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("An account already exists for this email");
        }
        Student student = new Student();
        student.setEmail(email);
        student.setPasswordHash(encoder.encode(request.password()));
        student.setFirstName(request.firstName().trim());
        student.setLastName(request.lastName().trim());
        student.setCollege(blankToEmpty(request.college()));
        student.setBranchYear(blankToEmpty(request.branchYear()));
        student.setRole("STUDENT");
        student = students.save(student);

        StudentProfile profile = new StudentProfile();
        profile.setStudent(student);
        profile.setEmail(email);
        profile.setFullName(student.fullName());
        profile.setCollege(blankToEmpty(request.college()));
        profile.setBranch(blankToEmpty(request.branchYear()));
        profile.setUsername(defaultUsername(email));
        profiles.save(profile);

        return AuthResponse.bearer(jwtService.generateToken(student.getId(), email), student.getId(), email, student.fullName());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Student student = students.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid"));
        if (!encoder.matches(request.password(), student.getPasswordHash())) {
            throw new BadCredentialsException("Invalid");
        }
        return AuthResponse.bearer(
                jwtService.generateToken(student.getId(), student.getEmail()),
                student.getId(),
                student.getEmail(),
                student.fullName()
        );
    }

    private static String blankToEmpty(String v) {
        return v == null ? "" : v.trim();
    }

    private static String defaultUsername(String email) {
        int at = email.indexOf('@');
        return at > 0 ? email.substring(0, at) : email;
    }
}
