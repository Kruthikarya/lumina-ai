package com.lumina.profile.auth;

import com.lumina.profile.domain.StudentProfile;
import com.lumina.profile.domain.StudentProfileRepository;
import com.lumina.profile.dto.ProfileDtos.AuthResponse;
import com.lumina.profile.dto.ProfileDtos.LoginRequest;
import com.lumina.profile.dto.ProfileDtos.RegisterRequest;
import com.lumina.profile.exception.ConflictException;
import com.lumina.profile.security.JwtService;
import com.lumina.profile.user.StudentUser;
import com.lumina.profile.user.StudentUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final StudentUserRepository users;
    private final StudentProfileRepository profiles;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            StudentUserRepository users,
            StudentProfileRepository profiles,
            PasswordEncoder encoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.users = users;
        this.profiles = profiles;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (users.existsByEmailIgnoreCase(req.email())) {
            throw new ConflictException("An account with that email already exists");
        }
        StudentUser user = new StudentUser();
        user.setEmail(req.email().trim().toLowerCase());
        user.setPasswordHash(encoder.encode(req.password()));
        user.setFirstName(req.firstName().trim());
        user.setLastName(req.lastName().trim());
        user.setRole("STUDENT");
        users.save(user);

        StudentProfile profile = new StudentProfile();
        profile.setUser(user);
        profile.setFullName(user.fullName());
        profile.setEmail(user.getEmail());
        profile.setCollege(blankToNull(req.college()));
        profile.setBranch(blankToNull(req.branchYear()));
        profile.setUsername(defaultUsername(user));
        profiles.save(profile);

        String token = jwtService.issue(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.fullName());
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email().trim().toLowerCase(), req.password())
        );
        StudentUser user = users.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Invalid"));
        String token = jwtService.issue(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.fullName());
    }

    private static String defaultUsername(StudentUser user) {
        String base = (user.getFirstName() + "." + user.getLastName().charAt(0)).toLowerCase().replaceAll("[^a-z0-9.]", "");
        return base.isBlank() ? "student" : base;
    }

    private static String blankToNull(String v) {
        return v == null || v.isBlank() ? null : v.trim();
    }
}
