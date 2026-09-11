package com.devops.taskmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Task Model / Entity.
 * 
 * @Entity tells JPA (Hibernate) that this class represents a table in the database.
 * @Table(name = "tasks") explicitly sets the table name to 'tasks'.
 * @Data, @NoArgsConstructor, @AllArgsConstructor are Lombok annotations that 
 * automatically generate Getters, Setters, Constructors, and toString() behind the scenes.
 */
@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    /**
     * The Primary Key for the table.
     * GenerationType.IDENTITY means the database will auto-increment this ID automatically.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The title of the task. It cannot be null.
    @Column(nullable = false)
    private String title;

    // The description of the task.
    @Column(length = 500)
    private String description;

    // The status of the task. Will default to false (not completed).
    private boolean completed = false;

    // Timestamp of when the task was created.
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * @PrePersist is a JPA callback that runs right before the entity is saved 
     * to the database for the first time. It sets the creation date automatically.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
