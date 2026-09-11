# ☸️ OKD / Kubernetes Explanation

This folder contains the "Manifests" (YAML files). Think of OKD/Kubernetes as a highly organized factory. These YAML files are the blueprints we give to the factory manager to tell them exactly how to run our containers in the cloud.

## 📄 Core Concepts (Explained Simply)

* **Deployment**: "I want you to run this specific Docker container, and please keep 2 copies running at all times so if one crashes, the other is still working."
* **Service**: "Give my running containers a permanent internal nickname (like an IP address) so other containers can find them."
* **Route**: "Open a door to the outside internet so real users can access this service."
* **Secret**: "Here is a locked safe with passwords inside. Only give it to the containers that need it."

## 📂 File by File Explanation

### 1. `postgres/` (The Database)
* **`secret.yaml`**: Holds our database username and password in a secure, encoded format.
* **`deployment.yaml`**: Tells OKD to run the official PostgreSQL docker container. It injects the passwords from the `secret.yaml` into the container.
* **`service.yaml`**: Gives the database an internal network name (`postgres`) on port 5432.

### 2. `backend/` (The Java API)
* **`deployment.yaml`**: Tells OKD to run our Java Backend Docker image. We set `replicas: 2`, which means OKD will run TWO identical Java servers. If a lot of users visit at once, the traffic is split between them! It also tells the Java app to connect to the `postgres` service we created above.
* **`service.yaml`**: Gives our two Java servers a single internal network name (`task-backend`). The frontend will send requests here.

### 3. `frontend/` (The React Website)
* **`deployment.yaml`**: Tells OKD to run our Nginx Docker container (which holds the React website).
* **`service.yaml`**: Gives the frontend an internal network name.
* **`route.yaml`**: This is unique to OpenShift/OKD! It takes the frontend `Service` and exposes it to the public internet. OKD will automatically generate a public URL (like `http://task-frontend.apps.my-cluster.com`) so you can access the website from your phone or laptop!
