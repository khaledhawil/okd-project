package com.devops.taskmanager.repository;

import com.devops.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Task Repository interface.
 * 
 * By extending JpaRepository, Spring Data JPA automatically provides us with
 * standard database operations (CRUD: Create, Read, Update, Delete) 
 * without us writing a single line of SQL or implementation code!
 * 
 * <Task, Long> means this repository manages the 'Task' entity, and the primary key is of type 'Long'.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // We can add custom query methods here later if needed, e.g.:
    // List<Task> findByCompleted(boolean completed);
}
