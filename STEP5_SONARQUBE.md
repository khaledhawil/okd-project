# 📖 Step 5: SonarQube (Explained Simply)

## What is SonarQube?

SonarQube is a **code quality checker**. Think of it like a spelling and grammar checker (like Grammarly), but for code.

Before you submit your homework, Grammarly checks for:
- Spelling mistakes
- Grammar errors
- Readability issues

SonarQube does the same for code:
- **Bugs** → "This line will crash when the user enters null"
- **Vulnerabilities** → "You hardcoded a password! That's a security risk"
- **Code Smells** → "This method is 200 lines long — break it into smaller pieces"
- **Test Coverage** → "Only 30% of your code has tests — that's too low"

```
Your Code → SonarQube scans it → Dashboard shows results

┌──────────────────────────────────────┐
│         SonarQube Dashboard          │
│                                      │
│  Bugs:            2 🔴               │
│  Vulnerabilities: 0 🟢               │
│  Code Smells:     5 🟡               │
│  Coverage:        78% 🟢            │
│                                      │
│  Quality Gate:    PASSED ✅          │
└──────────────────────────────────────┘
```

---

## The `sonar-project.properties` Files

We have TWO of these files — one for the backend, one for the frontend.

### Backend (`backend/sonar-project.properties`)

```properties
sonar.projectKey=task-manager-backend
sonar.sources=src/main/java
sonar.tests=src/test/java
sonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
```

| Line | Meaning |
|------|---------|
| `sonar.projectKey` | A unique name so SonarQube can identify this project |
| `sonar.sources` | "My Java source code is in this folder — scan it" |
| `sonar.tests` | "My test files are here — don't count them as source code" |
| `sonar.coverage.jacoco.xmlReportPaths` | "Jacoco generated a test coverage report here — read it" |

### Frontend (`frontend/sonar-project.properties`)

```properties
sonar.projectKey=task-manager-frontend
sonar.sources=src
sonar.language=js
```

Same idea, but for JavaScript/React code.

---

## What is Jacoco?

Jacoco is a Java tool that watches your tests run and records which lines of code were actually executed.

```
Example: Your method has 10 lines of code
         Your tests ran 8 of those 10 lines
         Coverage = 8/10 = 80%
```

Jacoco generates an XML report. SonarQube reads that report and shows the percentage on its dashboard.

We configured Jacoco in `pom.xml` as a Maven plugin. It runs automatically when you do `mvn test`.

---

## When Does SonarQube Run?

SonarQube runs in **Stage 3** of the GitLab CI pipeline:

```
[Build] → [Test + Jacoco Report] → [SonarQube Reads Report] → [Docker] → [Deploy]
```

It does NOT run on your laptop. It runs on the GitLab server, and results appear on the SonarQube web dashboard.
