# 📖 Step 7: OKD / OpenShift / Kubernetes (Explained Simply)

## What is OKD?

OKD is **Red Hat's free version of OpenShift**, which is built on top of **Kubernetes (K8s)**.

Think of Kubernetes as a **smart building manager**:
- You give it instructions: "I want 2 copies of my Java app running at all times"
- Kubernetes makes it happen
- If one copy crashes → Kubernetes automatically starts a new one
- If too many users come → you can tell it to start 5 copies instead

**OKD = Kubernetes + Extra Features** (like the Route object for public URLs, a nice web console, and built-in security).

---

## The YAML Files — Your Instructions to OKD

We have 3 folders in `k8s/`, one for each part of our app:

```
k8s/
├── postgres/      ← Database instructions
├── backend/       ← Java API instructions
└── frontend/      ← React website instructions
```

Each folder has YAML files. YAML is just a simple format for writing configuration — like filling out a form.

---

## The 4 Types of YAML Objects We Use

### 1. Secret — The Password Safe 🔒

```
"Here is a locked safe. Put the database password inside.
 Only give the password to containers that ask for it."
```

**File: `k8s/postgres/secret.yaml`**

```yaml
apiVersion: v1
kind: Secret
data:
  database-user: ZGV2b3BzX3VzZXI=          # "devops_user" in base64
  database-password: ZGV2b3BzX3Bhc3N3b3Jk  # "devops_password" in base64
```

| Line | Meaning |
|------|---------|
| `kind: Secret` | "This is a Secret object" |
| `data:` | "Here are the key-value pairs to store" |
| `ZGV2b3BzX3VzZXI=` | "devops_user" encoded in base64 (it's not encryption — it's just encoding) |

**Why base64?** Kubernetes requires it. You can encode any text:
```bash
echo -n 'devops_user' | base64
# Output: ZGV2b3BzX3VzZXI=
```

---

### 2. Deployment — The Worker Instructions 👷

```
"I want you to run this Docker container.
 Keep 2 copies alive at all times.
 If one dies, start a new one immediately."
```

**File: `k8s/backend/deployment.yaml`**

```yaml
kind: Deployment
metadata:
  name: task-backend
spec:
  replicas: 2
  template:
    spec:
      containers:
        - name: backend
          image: registry.gitlab.com/myuser/myproject/backend:latest
          ports:
            - containerPort: 8080
          env:
            - name: DB_HOST
              value: postgres
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: database-password
```

| Line | Meaning |
|------|---------|
| `kind: Deployment` | "This is a Deployment object" |
| `name: task-backend` | "Call this deployment 'task-backend'" |
| `replicas: 2` | "Run 2 copies of this container (for High Availability)" |
| `image: registry.../backend:latest` | "Download this Docker image from the registry" |
| `containerPort: 8080` | "The Java app inside listens on port 8080" |
| `env: DB_HOST: postgres` | "Set an environment variable inside the container" |
| `valueFrom: secretKeyRef:` | "Get the password from the Secret we created (not plain text!)" |

**What are replicas?**
```
Without replicas (replicas: 1):
  User → [Backend] ← if this crashes, app is DOWN ❌

With replicas (replicas: 2):
  User → [Backend #1] ← if this crashes...
       → [Backend #2] ← ...this one keeps working ✅
```

---

### 3. Service — The Internal Phone Number 📞

```
"Give my containers a fixed internal address so other 
 containers can always find them, even if they restart."
```

**File: `k8s/backend/service.yaml`**

```yaml
kind: Service
metadata:
  name: task-backend
spec:
  selector:
    app: task-backend
  ports:
    - port: 8080
      targetPort: 8080
```

| Line | Meaning |
|------|---------|
| `kind: Service` | "This is a Service object" |
| `name: task-backend` | "Other containers can reach this using the name 'task-backend'" |
| `selector: app: task-backend` | "Find all containers labeled 'task-backend' and send traffic to them" |
| `port: 8080` | "Listen on port 8080" |
| `targetPort: 8080` | "Forward traffic to the container's port 8080" |

**Why do we need this?**
Containers get random IP addresses. If a container crashes and restarts, it gets a NEW IP. The Service gives it a permanent name:

```
Without Service:
  "Backend is at 10.0.0.45" → container crashes → "Backend is now at 10.0.0.92" → BROKEN!

With Service:
  "Backend is at task-backend:8080" → container crashes → "Backend is still at task-backend:8080" → WORKS!
```

---

### 4. Route — The Public Door 🚪 (OKD Only!)

```
"Open a door to the internet so real users 
 can access the frontend from their browser."
```

**File: `k8s/frontend/route.yaml`**

```yaml
kind: Route
metadata:
  name: task-frontend-route
spec:
  to:
    kind: Service
    name: task-frontend
  port:
    targetPort: 80
```

| Line | Meaning |
|------|---------|
| `kind: Route` | "This is a Route object (only available in OpenShift/OKD)" |
| `to: name: task-frontend` | "Connect this public URL to the 'task-frontend' Service" |
| `targetPort: 80` | "Send traffic to port 80 (where Nginx is running)" |

**What happens when you create this?** OKD automatically generates a URL like:
```
http://task-frontend-route-myproject.apps.mycluster.com
```
Users can type this in their browser and see the React app!

---

## How Everything Connects Inside OKD

```
The Internet
     │
     ▼
┌─────────────────────────────────────────────────┐
│  OKD Cluster                                    │
│                                                 │
│  [Route] ──→ [Frontend Service] ──→ [Frontend]  │
│               (task-frontend)       (Nginx Pod)  │
│                     │                            │
│                     │ API calls                  │
│                     ▼                            │
│              [Backend Service] ──→ [Backend #1]  │
│               (task-backend)   ──→ [Backend #2]  │
│                     │                            │
│                     │ SQL queries                │
│                     ▼                            │
│              [Postgres Service] ──→ [PostgreSQL] │
│               (postgres)           (Database)    │
└─────────────────────────────────────────────────┘
```

---

## Useful `oc` Commands

After deploying, you can check on your app:

```bash
# Login to OKD
oc login https://your-okd-server:6443 --token=your-token

# Switch to your project
oc project my-task-manager

# See all running pods
oc get pods

# See all services
oc get services

# See the public URL
oc get routes

# Check logs of the backend
oc logs deployment/task-backend

# If something is wrong, describe the pod for details
oc describe pod task-backend-abc123
```
