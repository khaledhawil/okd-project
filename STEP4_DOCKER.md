# 📖 Step 4: Docker & Docker Compose (Explained Simply)

## What is Docker?

Imagine your friend builds an app on his laptop and it works perfectly. You download it, and it crashes.

**Why?** Because your laptop has different software versions, different settings, different operating system.

**Docker solves this.** It puts the app + everything it needs inside a box (container). That box works the same on ANY computer.

```
Without Docker:
  "It works on my machine!" 🤷

With Docker:
  "It works on EVERY machine!" ✅
```

---

## What is a Container vs an Image?

Think of it like cooking:

| Docker Term | Real Life Example |
|-------------|-------------------|
| **Image** | A recipe (the instructions) |
| **Container** | The actual cooked dish (running instance) |

You can cook the same recipe 10 times → 10 dishes (10 containers from 1 image).

---

## `docker-compose.yml` — Running Everything Together

Docker Compose lets you start multiple containers at once with ONE command.

Our `docker-compose.yml` starts 3 containers:

```
┌────────────────────────────────────────────────┐
│                docker-compose up                │
│                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│   │ postgres │←─│ backend  │←─│  frontend    │ │
│   │ Port 5432│  │ Port 8080│  │  Port 3000   │ │
│   │ Database │  │ Java API │  │  React + Nginx│ │
│   └──────────┘  └──────────┘  └──────────────┘ │
│                                                 │
│   User opens: http://localhost:3000             │
└────────────────────────────────────────────────┘
```

### Let me explain every section:

### Section 1: PostgreSQL (Database)

```yaml
postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: devops_user
      POSTGRES_PASSWORD: devops_password
      POSTGRES_DB: taskdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

| Line | Meaning |
|------|---------|
| `image: postgres:15-alpine` | "Download the official PostgreSQL image from Docker Hub" |
| `POSTGRES_USER` | "Create a database user named devops_user" |
| `POSTGRES_PASSWORD` | "Set the password to devops_password" |
| `POSTGRES_DB: taskdb` | "Create a database called taskdb" |
| `ports: "5432:5432"` | "Your laptop port 5432 → container port 5432" |
| `volumes: postgres_data:...` | "Save database files outside the container so data survives even if the container is deleted" |

### Section 2: Backend (Java)

```yaml
backend:
    build:
      context: ./backend
    environment:
      DB_HOST: postgres
      DB_USER: devops_user
      DB_PASSWORD: devops_password
    depends_on:
      - postgres
```

| Line | Meaning |
|------|---------|
| `build: context: ./backend` | "Build the Docker image using the Dockerfile in the backend folder" |
| `DB_HOST: postgres` | "The database hostname is 'postgres' — this is the container name above!" |
| `depends_on: postgres` | "Don't start Java until PostgreSQL is running" |

**How does `DB_HOST: postgres` work?**
Docker Compose creates a private network. Each container can talk to others by name. So `postgres` is like a nickname that points to the database container's IP address automatically.

### Section 3: Frontend (React)

```yaml
frontend:
    build:
      context: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

| Line | Meaning |
|------|---------|
| `ports: "3000:80"` | "Your laptop port 3000 → container port 80 (Nginx inside runs on 80)" |
| `depends_on: backend` | "Don't start the frontend until the backend is running" |

---

## How to Use It

Open a terminal in the project folder and run:

```bash
# Start everything
docker-compose up --build

# Stop everything
docker-compose down

# Stop everything AND delete database data
docker-compose down -v
```

Then open your browser at `http://localhost:3000` — you'll see the Task Manager app connected to a real database!
