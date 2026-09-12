package com.devops.auth.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security configuration class for the Auth microservice.
 * Configures the HTTP security filter chain, stateless session management,
 * CSRF protection, endpoint authorization rules, and password encoding beans.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configures the main security filter chain for HTTP requests.
     *
     * - Disables CSRF protection since this service uses stateless token-based authentication.
     * - Configures session management to STATELESS (no HTTP session created or used).
     * - Permits all inbound requests targeting '/api/auth/**' without requiring prior authentication.
     * - Requires authentication for any other hypothetical endpoints.
     *
     * @param http HttpSecurity builder to configure.
     * @return Configured {@link SecurityFilterChain}.
     * @throws Exception If an error occurs during configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable Cross-Site Request Forgery (CSRF) as REST APIs with JWT are stateless
                .csrf(AbstractHttpConfigurer::disable)
                // Enforce stateless session policy (no session cookies stored on the server)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Configure request path authorization
                .authorizeHttpRequests(auth -> auth
                        // Permit unauthenticated access to all auth endpoints (register, login, me)
                        .requestMatchers("/api/auth/**").permitAll()
                        // Require authentication for any other potential requests
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    /**
     * Exposes a {@link PasswordEncoder} bean utilizing the BCrypt strong hashing algorithm.
     * Used for hashing user passwords securely before database persistence and verifying login attempts.
     *
     * @return BCryptPasswordEncoder instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
