# 📖 Step 2: The Java Backend (Explained Simply)

The backend is the **brain** of the app. It sits between the user and the database.

---

## File 1: `pom.xml` — The Shopping List

Before you cook, you need ingredients. `pom.xml` is our shopping list. It tells Maven (a Java tool) what libraries to download.

Here are the ingredients we asked for:

| Ingredient (Library) | Why We Need It |
|----------------------|----------------|
| `spring-boot-starter-web` | Lets us create a web API that listens for requests |
| `spring-boot-starter-data-jpa` | Lets us talk to the database without writing SQL |
| `postgresql` | The driver (translator) that speaks PostgreSQL's language |
| `lombok` | Saves us from writing boring repetitive code |
| `jacoco-maven-plugin` | Measures how much of our code is tested (for SonarQube) |

**In simple words:** Without `pom.xml`, Java wouldn't know what tools to use. It's like trying to cook without buying ingredients first.

---

## File 2: `application.yml` — The Settings

This file answers one big question: **"Where is the database?"**

```yaml
url: jdbc:postgresql://${DB_HOST:localhost}:5432/${DB_NAME:taskdb}
```

Let me break this apart piece by piece:

| Piece | Meaning |
|-------|---------|
| `jdbc:postgresql://` | "I want to connect to a PostgreSQL database" |
| `${DB_HOST:localhost}` | "Look at the environment variable DB_HOST. If it doesn't exist, use localhost" |
| `:5432` | "The database is listening on port 5432" (this is PostgreSQL's default port) |
| `/${DB_NAME:taskdb}` | "The database name is taskdb" |

**Why use `${DB_HOST}` instead of a fixed address?**  
Because:
- On your laptop → DB_HOST = `localhost` (database is on your machine)
- In Docker Compose → DB_HOST = `postgres` (name of the postgres container)
- In OKD → DB_HOST = `postgres` (name of the Kubernetes Service)

Same code, different environments. No changes needed!

---

## File 3: `TaskManagerApplication.java` — The ON Switch

```java
@SpringBootApplication
public class TaskManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}
```

This is just the power button. When you run this file:
1. Spring Boot starts up
2. It scans all your other files automatically
3. It starts a web server on port 8080
4. It connects to PostgreSQL
5. Your API is ready!

**That's it.** Spring Boot does all the heavy work for you.

---

## File 4: `Task.java` — What Does a Task Look Like?

This file describes the shape of our data. Think of it as a form you fill out:

```
┌─────────────────────────────┐
│  Task Form                  │
│                             │
│  ID: _____ (auto-filled)    │
│  Title: _____               │
│  Description: _____         │
│  Completed: [ ] yes  [x] no │
│  Created At: _____ (auto)   │
└─────────────────────────────┘
```

Key things happening in this file:

| Code | What It Does |
|------|-------------|
| `@Entity` | "This class = a table in the database" |
| `@Table(name = "tasks")` | "Name the table 'tasks'" |
| `@Id` | "The 'id' field is the unique identifier" |
| `@GeneratedValue(strategy = GenerationType.IDENTITY)` | "Auto-generate the ID: 1, 2, 3, 4..." |
| `@Column(nullable = false)` | "Title is required — you can't leave it empty" |
| `@Data` (Lombok) | "Auto-create all getters and setters so I don't write them manually" |
| `@PrePersist` | "Right before saving to the database, set the current date/time" |

**In simple words:** When Spring Boot starts, it reads this file and creates a table in PostgreSQL that matches it exactly. You never write `CREATE TABLE` SQL — Spring does it for you.

---

## File 5: `TaskRepository.java` — The Database Helper

```java
public interface TaskRepository extends JpaRepository<Task, Long> {
}
```

Yes, that's the entire file. It looks empty, but it's actually very powerful.

By writing `extends JpaRepository<Task, Long>`, Spring Boot automatically gives you these methods for free:

| Method You Get For Free | What It Does |
|------------------------|-------------|
| `findAll()` | Get all tasks from the database |
| `findById(5)` | Get the task with ID = 5 |
| `save(task)` | Insert a new task OR update an existing one |
| `delete(task)` | Delete a task |
| `count()` | Count how many tasks exist |

**In simple words:** Instead of writing `SELECT * FROM tasks WHERE id = 5`, you just call `findById(5)`. Spring writes the SQL for you behind the scenes.

---

## File 6: `TaskController.java` — The API Endpoints (The Doors)

This is the most important file. It creates the "doors" (URLs) that the frontend can knock on.

Think of it like a receptionist at a hotel:

```
Guest: "I want to see all rooms"     → GET    /api/tasks      → getAllTasks()
Guest: "I want to see room #5"       → GET    /api/tasks/5    → getTaskById(5)
Guest: "I want to book a new room"   → POST   /api/tasks      → createTask()
Guest: "I want to change my room"    → PUT    /api/tasks/5    → updateTask(5)
Guest: "I want to cancel my room"    → DELETE /api/tasks/5    → deleteTask(5)
```

Key things in this file:

| Code | What It Does |
|------|-------------|
| `@RestController` | "This class handles web requests and returns JSON" |
| `@RequestMapping("/api/tasks")` | "All URLs in this class start with /api/tasks" |
| `@CrossOrigin(origins = "*")` | "Allow the React frontend (different port) to call me" |
| `@GetMapping` | "When someone sends a GET request, run this method" |
| `@PostMapping` | "When someone sends a POST request, run this method" |
| `@RequestBody Task task` | "Take the JSON from the request and convert it to a Task object" |
| `@PathVariable Long id` | "Take the number from the URL (like /api/tasks/5) and put it in the 'id' variable" |
| `ResponseEntity.notFound().build()` | "Return a 404 error if the task doesn't exist" |

---

## File 7: `backend/Dockerfile` — Packaging the Java App

Imagine you're moving to a new house. You could bring your entire messy room... OR you could pack only the things you need into a clean suitcase.

The Dockerfile does the "clean suitcase" approach. It has **2 stages**:

### Stage 1: The Workshop (Build)
```
┌──────────────────────────────────┐
│  BIG workshop with all tools     │
│  (Maven, JDK, compiler)         │
│                                  │
│  1. Copy source code inside      │
│  2. Run: mvn clean package       │
│  3. Result: app.jar is created   │
│                                  │
│  Size: ~500 MB (too big!)        │
└──────────────────────────────────┘
```

### Stage 2: The Suitcase (Runtime)
```
┌──────────────────────────────────┐
│  TINY suitcase (Alpine Linux)    │
│  (Only Java Runtime, no tools)   │
│                                  │
│  1. Create a non-root user       │
│  2. Copy ONLY the app.jar        │
│  3. Run the app                  │
│                                  │
│  Size: ~100 MB (small and safe!) │
└──────────────────────────────────┘
```

**Why non-root user?** If a hacker breaks into the container, they only have limited access (like a guest account on a computer), not admin access.
