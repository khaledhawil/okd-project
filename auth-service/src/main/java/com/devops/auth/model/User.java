package com.devops.auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * JPA Entity representing an application user in the authentication system.
 * Maps to the "users" table in the PostgreSQL database.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * Unique identifier for the user, auto-generated using database identity column.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Full name or display name of the user.
     */
    @Column(nullable = false)
    private String name;

    /**
     * User's email address, used as the primary username for authentication.
     * Must be unique across all user records.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * User's password stored securely as a salted BCrypt hash.
     * Plain text passwords must never be stored here.
     */
    @Column(nullable = false)
    private String password;

    /**
     * Timestamp indicating when the user account was created.
     * Populated automatically before initial database insertion.
     */
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * Lifecycle callback hook executed before the entity is persisted.
     * Automatically sets the creation timestamp to the current time.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
