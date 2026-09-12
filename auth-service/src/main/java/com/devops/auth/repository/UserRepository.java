package com.devops.auth.repository;

import com.devops.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link User} entities.
 * Provides data access operations and query methods for user authentication and management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their unique email address.
     *
     * @param email The email address to search for.
     * @return An {@link Optional} containing the user if found, or empty if not found.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a user already exists with the specified email address.
     *
     * @param email The email address to check.
     * @return {@code true} if a record exists with the email, {@code false} otherwise.
     */
    Boolean existsByEmail(String email);
}
