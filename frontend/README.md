# ⚛️ React Frontend Explanation

This folder contains the React application. This is the visual part of the project—the buttons, text boxes, and lists that the user actually sees and clicks on.

## 📄 File by File Explanation

### 1. `package.json` & `vite.config.js`
* **What are they?** The project configuration.
* **Easy Explanation:** Just like `pom.xml` is for Java, `package.json` is for Node.js. It lists the libraries we need, like `react` and `axios`. `vite.config.js` configures "Vite", which is an ultra-fast tool that bundles our React code together so the browser can read it.

### 2. `index.html` & `src/main.jsx`
* **What are they?** The entry points.
* **Easy Explanation:** 
  * `index.html` is the blank canvas. It's a basic web page with one empty `<div>` called "root".
  * `main.jsx` is the paintbrush. It grabs the React application and "paints" it inside that empty "root" div on the HTML page.

### 3. `src/App.jsx`
* **What is it?** The Main Screen and Logic.
* **Easy Explanation:** This is where the magic happens! This file contains the HTML for our text box and task list. 
  * It uses `useState` to remember things (like the list of tasks).
  * It uses a library called `axios` to send messages over the internet to our Java Backend. 
  * For example, when you click "Add Task", it uses `axios.post` to send the new task text to the Java API!

### 4. `Dockerfile`
* **What is it?** The packaging instructions.
* **Easy Explanation:** Just like the Java Dockerfile, this is a two-step process:
  1. First, it uses Node.js to translate our React code into plain, standard HTML and JavaScript files.
  2. Then, it puts those plain files inside an **Nginx** web server.

### 5. `nginx.conf`
* **What is it?** Web Server Rules.
* **Easy Explanation:** Nginx is the waiter that serves our website to the user. This file tells Nginx: "If a user asks for a page that doesn't exist, just give them `index.html`." This is required for React apps so they can handle changing pages smoothly without real reloading.
