package com.gameshop.security;

import com.gameshop.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Simple Token Authentication Filter
 * Custom filter để xác thực token format: accountId:role:timestamp
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SimpleTokenAuthenticationFilter extends OncePerRequestFilter {

    private final AuthService authService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            String token = extractToken(request);

            if (token != null && authService.validateToken(token)) {
                UserDetails userDetails = loadUserFromToken(token);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Set authentication for user: {}", userDetails.getUsername());
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extract token from Authorization header
     * Format: "Bearer <token>"
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    /**
     * Load UserDetails from token
     * Token format: accountId:role:timestamp
     */
    private UserDetails loadUserFromToken(String token) {
        try {
            String[] parts = token.split(":");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid token format");
            }

            String accountId = parts[0];
            String role = parts[1];

            // Create UserDetails với authority ROLE_<role>
            return User.builder()
                    .username(accountId)
                    .password("")
                    .authorities(Collections.singletonList(
                            new SimpleGrantedAuthority("ROLE_" + role)))
                    .build();

        } catch (Exception e) {
            log.error("Error parsing token: {}", e.getMessage());
            throw new RuntimeException("Invalid token");
        }
    }
}
