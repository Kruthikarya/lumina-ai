package com.lumina.profile.security;

import com.lumina.profile.user.StudentUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class StudentUserDetailsService implements UserDetailsService {

    private final StudentUserRepository users;

    public StudentUserDetailsService(StudentUserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return users.findByEmailIgnoreCase(email)
                .map(StudentPrincipal::new)
                .orElseThrow(() -> new UsernameNotFoundException("Student not found"));
    }
}
