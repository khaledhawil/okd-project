# ==========================================
# STAGE 1: Build the Application
# ==========================================
# We use an official Maven image containing Java 17 to build the application.
# Named 'builder' stage for multi-stage separation.
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set the working directory inside the build container
WORKDIR /app

# Copy the Maven pom.xml descriptor and project source code
COPY pom.xml .
COPY src ./src

# Compile the code and package it into a runnable Spring Boot fat JAR.
# Tests are skipped here to optimize build time in Docker (tests run in CI/CD pipeline).
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Create the Runtime Image
# ==========================================
# We use a lightweight Java Runtime Environment (JRE) Alpine image to minimize container footprint.
FROM eclipse-temurin:17-jre-alpine

# Security Best Practice: Create a dedicated non-privileged user and group to run the app.
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /app

# Copy the compiled auth-service .jar file from the 'builder' stage into the runtime image.
COPY --from=builder /app/target/auth-service-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8090 (the port configured for auth-service in application.yml)
EXPOSE 8090

# The container startup command to execute the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
