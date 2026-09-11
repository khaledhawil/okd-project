package com.devops.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Spring Boot application.
 * @SpringBootApplication is a convenience annotation that adds:
 * - @Configuration: Tags the class as a source of bean definitions.
 * - @EnableAutoConfiguration: Tells Spring Boot to start adding beans based on classpath settings.
 * - @ComponentScan: Tells Spring to look for other components, configurations, and services in the 'com.devops.taskmanager' package.
 */
@SpringBootApplication
public class TaskManagerApplication {

    public static void main(String[] args) {
        // Starts the embedded Tomcat server and initializes the Spring application context
        SpringApplication.run(TaskManagerApplication.class, args);
        System.out.println("====== Task Manager Backend Started Successfully ======");
    }
}
