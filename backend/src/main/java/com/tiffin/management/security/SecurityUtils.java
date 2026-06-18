package com.tiffin.management.security;

import com.tiffin.management.exception.UnauthorizedActionException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new UnauthorizedActionException("User is not authenticated");
        }
        return userDetails;
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public static boolean isAdmin() {
        return "ADMIN".equals(getCurrentUser().getRole());
    }

    public static boolean isStudent() {
        return "STUDENT".equals(getCurrentUser().getRole());
    }
}
