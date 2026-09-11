# 🏗️ The 3-Tier DevOps Project

Welcome to your DevOps project! This file explains the "Big Picture" of how everything connects in an easy way.

## 🌟 The Big Picture

This project is a **Task Management System**. It is built using a "3-Tier Architecture", which means it has three separate layers that talk to each other:

1. **Frontend (The User Interface):** Built with React. This is what the user sees in their web browser.
2. **Backend (The Brains):** Built with Java (Spring Boot). It receives requests from the Frontend, processes them, and talks to the database.
3. **Database (The Memory):** Built with PostgreSQL. It safely stores all the tasks.

## 📂 Folder Structure

Here is what you will find in this project:

* **`/frontend`** 👉 Contains all the React code for the website.
* **`/backend`** 👉 Contains all the Java Spring Boot code for the API.
* **`/k8s`** 👉 Contains the OKD/Kubernetes configuration files to deploy the app to the cloud.
* **`docker-compose.yml`** 👉 A magical file that lets you run the entire project on your local laptop with one command.
* **`.gitlab-ci.yml`** 👉 The instructions for GitLab to automatically test, build, and deploy your code.

## 🚀 How to Run It Locally

Before putting this on OKD, you can test it on your laptop using Docker.

1. Open a terminal in this folder.
2. Run this command:
   ```bash
   docker-compose up --build
   ```
3. Docker will download PostgreSQL, build your Java app, build your React app, and link them all together!
4. Open your browser and go to: `http://localhost:3000`

---
**Want to understand each part?**
I have created a `README.md` file inside every folder. 
* Go to `backend/README.md` to learn about the Java code.
* Go to `frontend/README.md` to learn about the React code.
* Go to `k8s/README.md` to learn about OKD deployment.
* Read `ci-cd-explanation.md` to learn about GitLab and SonarQube!
