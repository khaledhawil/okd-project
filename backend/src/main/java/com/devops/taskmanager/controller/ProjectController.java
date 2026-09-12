package com.devops.taskmanager.controller;

import com.devops.taskmanager.model.Project;
import com.devops.taskmanager.repository.ProjectRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    private Long getUserId(HttpServletRequest request) {
        return (Long) request.getAttribute("userId");
    }

    @GetMapping
    public List<Project> getAllProjects(HttpServletRequest request) {
        return projectRepository.findByUserId(getUserId(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id, HttpServletRequest request) {
        return projectRepository.findById(id)
                .filter(p -> p.getUserId().equals(getUserId(request)))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Project createProject(@RequestBody Project project, HttpServletRequest request) {
        project.setUserId(getUserId(request));
        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project details, HttpServletRequest request) {
        return projectRepository.findById(id)
                .filter(p -> p.getUserId().equals(getUserId(request)))
                .map(existing -> {
                    existing.setName(details.getName());
                    existing.setDescription(details.getDescription());
                    existing.setStatus(details.getStatus());
                    existing.setPriority(details.getPriority());
                    return ResponseEntity.ok(projectRepository.save(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, HttpServletRequest request) {
        return projectRepository.findById(id)
                .filter(p -> p.getUserId().equals(getUserId(request)))
                .map(project -> {
                    projectRepository.delete(project);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
