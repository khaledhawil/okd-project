package com.devops.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Authentication Microservice.
 *
 * This Spring Boot application handles user management, authentication,
 * and JWT issuance for the DevOps task management platform.
 */
@SpringBootApplication
public class AuthServiceApplication {

    /**
     * Main method that bootstraps and launches the Spring Boot application.
     *
     * @param args Command line arguments passed during application startup.
     */
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
