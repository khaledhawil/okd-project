package com.devops.auth.controller;

import com.devops.auth.dto.AuthResponse;
import com.devops.auth.dto.LoginRequest;
import com.devops.auth.dto.RegisterRequest;
import com.devops.auth.model.User;
import com.devops.auth.repository.UserRepository;
import com.devops.auth.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

/**
 * REST Controller providing authentication and user management endpoints.
 * Handles account registration, login verification, token generation,
 * and current user profile inspection.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Constructs AuthController with required dependencies.
     *
     * @param userRepository Repository for persisting and retrieving user entities.
     * @param jwtUtil Utility for generating and validating JSON Web Tokens.
     */
    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Registers a new user account.
     * Checks if the email is already registered, hashes the plain password using BCrypt,
     * persists the new user to the database, generates a signed JWT, and returns the response.
     *
     * @param request Payload containing name, email, and plain-text password.
     * @return 200 OK with {@link AuthResponse} if registration succeeds,
     *         or 400 Bad Request if the email is already in use.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Verify if the email is already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error: Email is already in use!"));
        }

        // Hash the password with BCrypt
        String hashedPassword = new BCryptPasswordEncoder().encode(request.getPassword());

        // Create and populate the user entity
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);

        // Save the new user record in the PostgreSQL database
        User savedUser = userRepository.save(user);

        // Generate JWT token containing the new user's details
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getName());

        // Return AuthResponse containing token and user profile
        return ResponseEntity.ok(new AuthResponse(
                token,
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getId()
        ));
    }

    /**
     * Authenticates existing user credentials.
     * Finds the user by email, verifies the password hash using BCrypt,
     * generates a signed JWT, and returns the user information and token.
     *
     * @param request Payload containing email and plain-text password.
     * @return 200 OK with {@link AuthResponse} on successful credentials,
     *         or 401 Unauthorized on invalid credentials.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Retrieve user by email
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        // Check if user exists and password matches the stored BCrypt hash
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        User user = userOpt.get();

        // Generate JWT token for the authenticated user
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getName());

        // Return AuthResponse with fresh token and user profile
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getId()
        ));
    }

    /**
     * Retrieves the profile of the currently authenticated user from the Authorization token header.
     *
     * @param authHeader The "Authorization" HTTP header containing the Bearer token.
     * @return 200 OK with {@link AuthResponse} if the token is valid and user exists,
     *         or 401 Unauthorized / 404 Not Found if token is missing/invalid or user not found.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Validate presence of Authorization header and Bearer scheme
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing or invalid Authorization header"));
        }

        // Extract raw token string by removing the "Bearer " prefix
        String token = authHeader.substring(7);

        // Validate the JWT signature and expiration
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired token"));
        }

        // Extract user email from token subject
        String email = jwtUtil.extractEmail(token);

        // Look up the current user in the database
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        // Return user info and keep the valid token in the response
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getId()
        ));
    }
}
