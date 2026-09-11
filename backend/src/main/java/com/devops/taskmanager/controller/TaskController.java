package com.devops.taskmanager.controller;

import com.devops.taskmanager.model.Task;
import com.devops.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller that handles incoming HTTP requests from the Frontend.
 * 
 * @RestController indicates that this class serves REST endpoints. Data is returned as JSON.
 * @RequestMapping("/api/tasks") means all endpoints here start with /api/tasks.
 * @CrossOrigin("*") allows our React frontend (running on a different port) to communicate with this backend without CORS security errors.
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // Allow frontend to call the API
public class TaskController {

    private final TaskRepository taskRepository;

    /**
     * Dependency Injection via Constructor.
     * Spring automatically injects the TaskRepository implementation here.
     */
    @Autowired
    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // ==========================================
    // GET /api/tasks (Fetch all tasks)
    // ==========================================
    @GetMapping
    public List<Task> getAllTasks() {
        // Uses the repository to fetch all tasks from the DB.
        return taskRepository.findAll();
    }

    // ==========================================
    // GET /api/tasks/{id} (Fetch a single task)
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        // Tries to find the task by its ID.
        // If found, returns 200 OK with the task data.
        // If not found, returns 404 Not Found.
        return taskRepository.findById(id)
                .map(task -> ResponseEntity.ok().body(task))
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // POST /api/tasks (Create a new task)
    // ==========================================
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        // @RequestBody maps the incoming JSON to a Task object.
        // taskRepository.save() inserts it into the PostgreSQL database.
        return taskRepository.save(task);
    }

    // ==========================================
    // PUT /api/tasks/{id} (Update a task)
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        // First, check if the task exists.
        return taskRepository.findById(id).map(existingTask -> {
            // Update the existing task's fields with the new data
            existingTask.setTitle(taskDetails.getTitle());
            existingTask.setDescription(taskDetails.getDescription());
            existingTask.setCompleted(taskDetails.isCompleted());
            
            // Save the updated task back to the database
            Task updatedTask = taskRepository.save(existingTask);
            return ResponseEntity.ok(updatedTask);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // DELETE /api/tasks/{id} (Delete a task)
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        // Check if it exists, then delete it.
        return taskRepository.findById(id).map(task -> {
            taskRepository.delete(task);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
