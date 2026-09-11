# 📖 Step 6: GitLab CI/CD Pipeline (Explained Simply)

## What is CI/CD?

Without CI/CD, every time you change code you have to:
1. Compile the code manually
2. Run tests manually
3. Check code quality manually
4. Build Docker images manually
5. Upload to the server manually
6. Restart the app manually

**With CI/CD, you just push your code to GitLab, and ALL of this happens automatically.**

```
You: git push
GitLab: "I got it! Let me handle everything else..."
  ↓
  [Build] → [Test] → [SonarQube] → [Docker] → [Deploy to OKD]
  ↓
Your app is live! 🎉
```

---

## The `.gitlab-ci.yml` File — Section by Section

### Section 1: Stages (The Order)

```yaml
stages:
  - build
  - test
  - sonar
  - docker
  - deploy
```

This says: "Do these 5 things in this exact order. If any step fails, STOP."

Think of it like an assembly line in a factory:

```
Station 1     Station 2     Station 3      Station 4       Station 5
[Assemble] → [Inspect]  → [Quality Lab] → [Package Box] → [Ship to Store]
   build        test         sonar           docker           deploy

If Station 2 finds a defect → STOP the line! Don't ship broken products.
```

---

### Section 2: Build Stage

```yaml
build_backend:
  stage: build
  image: maven:3.9.6-eclipse-temurin-17
  script:
    - cd backend
    - mvn clean compile
```

| Line | Meaning |
|------|---------|
| `stage: build` | "This job belongs to the 'build' stage" |
| `image: maven:...` | "Run this job inside a container that has Maven + Java installed" |
| `script:` | "Here are the commands to run:" |
| `cd backend` | "Go into the backend folder" |
| `mvn clean compile` | "Compile the Java code. If there are syntax errors → FAIL" |

```yaml
build_frontend:
  stage: build
  image: node:18-alpine
  script:
    - cd frontend
    - npm install
    - npm run build
```

| Line | Meaning |
|------|---------|
| `image: node:18-alpine` | "Use a container with Node.js installed" |
| `npm install` | "Download all the React libraries listed in package.json" |
| `npm run build` | "Compile React into production-ready HTML/JS files" |

**Both jobs run at the same time** (in parallel) because they're in the same stage!

---

### Section 3: Test Stage

```yaml
test_backend:
  stage: test
  image: maven:3.9.6-eclipse-temurin-17
  script:
    - cd backend
    - mvn test
  artifacts:
    paths:
      - backend/target/site/jacoco/jacoco.xml
```

| Line | Meaning |
|------|---------|
| `mvn test` | "Run all unit tests. If any test fails → pipeline STOPS" |
| `artifacts: paths:` | "After tests finish, SAVE the Jacoco coverage report file" |

**Why save the report?** Because the next stage (SonarQube) needs it. Each stage runs in a fresh, clean container — nothing is shared between them unless you explicitly save it as an "artifact."

```
[Test Stage]                    [Sonar Stage]
    │                                │
    │ → jacoco.xml (artifact) ──────→│ reads it
    │                                │
```

---

### Section 4: SonarQube Stage

```yaml
sonar_backend:
  stage: sonar
  image: sonarsource/sonar-scanner-cli:latest
  script:
    - cd backend
    - sonar-scanner
  allow_failure: true
```

| Line | Meaning |
|------|---------|
| `image: sonarsource/sonar-scanner-cli` | "Use a container with the SonarQube scanner tool" |
| `sonar-scanner` | "Scan the code and send results to the SonarQube server" |
| `allow_failure: true` | "Even if SonarQube finds problems, don't stop the pipeline" |

The scanner reads `sonar-project.properties` to know where to find the source code and the Jacoco report.

---

### Section 5: Docker Stage

```yaml
docker_build_backend:
  stage: docker
  image: docker:24.0.5
  services:
    - docker:24.0.5-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - cd backend
    - docker build -t $CI_REGISTRY_IMAGE/backend:latest .
    - docker push $CI_REGISTRY_IMAGE/backend:latest
```

| Line | Meaning |
|------|---------|
| `services: docker:dind` | "Docker-in-Docker. We need Docker inside our Docker container to build images" |
| `docker login ...` | "Log into GitLab's Container Registry (like a warehouse for Docker images)" |
| `docker build -t ... .` | "Build the Docker image using the Dockerfile in the current folder" |
| `docker push ...` | "Upload the image to the GitLab warehouse" |

**What are `$CI_REGISTRY_*` variables?** GitLab provides these automatically. You don't set them:

| Variable | What GitLab Fills In |
|----------|---------------------|
| `$CI_REGISTRY` | `registry.gitlab.com` |
| `$CI_REGISTRY_USER` | Your GitLab username |
| `$CI_REGISTRY_PASSWORD` | A temporary password for this pipeline |
| `$CI_REGISTRY_IMAGE` | `registry.gitlab.com/your-username/your-project` |

---

### Section 6: Deploy Stage

```yaml
deploy_okd:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    # Step 1: Log into OKD
    - kubectl config set-cluster okd --server="$OKD_SERVER" --insecure-skip-tls-verify=true
    - kubectl config set-credentials gitlab --token="$OKD_TOKEN"
    - kubectl config use-context okd-context

    # Step 2: Replace placeholder with real registry URL
    - sed -i "s|\$CI_REGISTRY_IMAGE|$CI_REGISTRY_IMAGE|g" k8s/backend/deployment.yaml

    # Step 3: Apply YAML files to OKD
    - kubectl apply -f k8s/postgres/
    - kubectl apply -f k8s/backend/
    - kubectl apply -f k8s/frontend/
  only:
    - main
```

| Line | Meaning |
|------|---------|
| `image: bitnami/kubectl` | "Use a container with the kubectl tool (to talk to OKD)" |
| `kubectl config set-cluster ...` | "Tell kubectl: here is the address of my OKD server" |
| `kubectl config set-credentials ...` | "Tell kubectl: here is my login token" |
| `sed -i "s\|...\|..."` | "Find-and-replace the placeholder text in the YAML files with the real registry URL" |
| `kubectl apply -f k8s/postgres/` | "Send all the postgres YAML files to OKD → OKD creates the database" |
| `only: main` | "ONLY deploy when pushing to the 'main' branch — not feature branches" |

---

## What Variables Do YOU Need to Set?

Go to GitLab → Your Project → Settings → CI/CD → Variables → Add:

| Variable Name | Where to Get It | Example |
|--------------|-----------------|---------|
| `SONAR_HOST_URL` | Your SonarQube server address | `http://sonarqube.mycompany.com` |
| `SONAR_TOKEN` | SonarQube → My Account → Security → Generate Token | `squ_abc123...` |
| `OKD_SERVER` | Your OKD cluster API URL | `https://api.okd.mycompany.com:6443` |
| `OKD_TOKEN` | Run `oc whoami -t` on your terminal | `sha256~abc123...` |
| `OKD_NAMESPACE` | Your OKD project name | `my-task-manager` |
