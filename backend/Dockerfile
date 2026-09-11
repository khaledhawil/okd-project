# ==========================================
# STAGE 1: Build the Application
# ==========================================
# We use a Maven image containing Java 17 to build our application.
# We name this stage 'builder'.
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and source code into the container
COPY pom.xml .
COPY src ./src

# Run Maven to compile the code and package it into a .jar file.
# We skip tests here to speed up the Docker build (tests will be run in GitLab CI).
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Create the Runtime Image
# ==========================================
# We use a lightweight Java Runtime Environment (JRE) image.
# This makes our final container much smaller and more secure (no Maven included).
FROM eclipse-temurin:17-jre-alpine

# Security Best Practice: Create a non-root user to run the app.
# Running as root inside a container can be a security risk.
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /app

# Copy only the compiled .jar file from the 'builder' stage into this final image.
COPY --from=builder /app/target/task-manager-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 (the port our Spring Boot app uses)
EXPOSE 8080

# The command to start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
