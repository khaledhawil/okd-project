package com.devops.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for user registration requests.
 * Encapsulates the payload submitted by a client when creating a new account.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    /**
     * The full name of the user registering.
     */
    private String name;

    /**
     * The email address to register with (must be unique).
     */
    private String email;

    /**
     * The plain-text password chosen by the user (to be hashed using BCrypt before persistence).
     */
    private String password;
}
