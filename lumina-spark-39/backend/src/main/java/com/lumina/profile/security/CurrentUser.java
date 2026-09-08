package com.lumina.profile.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    public StudentPrincipal require() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof StudentPrincipal principal)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authenticated");
        }
        return principal;
    }

    public String userId() {
        return require().getId();
    }
}
