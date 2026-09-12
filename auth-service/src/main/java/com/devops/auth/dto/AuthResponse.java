package com.devops.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) returned upon successful authentication or registration.
 * Contains user identification information and the issued JSON Web Token (JWT).
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    /**
     * Signed JSON Web Token (JWT) authorizing future requests.
     */
    private String token;

    /**
     * The full name of the authenticated user.
     */
    private String name;

    /**
     * The email address of the authenticated user.
     */
    private String email;

    /**
     * The primary database ID of the authenticated user.
     */
    private Long userId;
}
