package com.gameshop.config;

import com.gameshop.security.CustomAccessDeniedHandler;
import com.gameshop.security.CustomAuthenticationEntryPoint;
import com.gameshop.security.SimpleTokenAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security Configuration
 * Cấu hình bảo mật cho API với stateless session và role-based access control
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final SimpleTokenAuthenticationFilter authFilter;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (stateless API)
                .csrf(AbstractHttpConfigurer::disable)

                // CORS configuration (use existing CorsConfig)
                .cors(cors -> {
                })

                // Stateless session
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - Authentication
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // Public endpoints - Health check
                        .requestMatchers("/api/v1/health").permitAll()

                        // Public endpoints - Error page
                        .requestMatchers("/error").permitAll()

                        // Public endpoints - Swagger/OpenAPI documentation
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()

                        // Public endpoints - Category (READ only)
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()

                        // Public endpoints - Product (READ only)
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()

                        // Public endpoints - Order (create and view own orders)
                        .requestMatchers(HttpMethod.POST, "/api/v1/orders").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/orders/my-orders").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/orders/{id}").permitAll()

                        // Admin-only endpoints - All /admin/* paths
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                        // Admin-only endpoints - Category management
                        .requestMatchers(HttpMethod.POST, "/api/v1/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/categories/**").hasRole("ADMIN")

                        // Admin-only endpoints - Product management
                        .requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasRole("ADMIN")

                        // Admin-only endpoints - Order management
                        .requestMatchers(HttpMethod.GET, "/api/v1/orders").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/orders/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/orders/{id}/cancel").hasRole("ADMIN")

                        // All other requests require authentication
                        .anyRequest().authenticated())

                // Add custom filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)

                // Exception handling
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler));

        return http.build();
    }

    @Bean
    @SuppressWarnings("deprecation")
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}
