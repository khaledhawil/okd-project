package com.devops.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for user login requests.
 * Encapsulates credentials provided by a client during authentication.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    /**
     * The email address associated with the user account.
     */
    private String email;

    /**
     * The plain-text password to verify against the stored BCrypt hash.
     */
    private String password;
}
