# 📖 Step 3: The React Frontend (Explained Simply)

The frontend is the **face** of the app — it's what the user sees and clicks on.

---

## File 1: `package.json` — The Frontend Shopping List

Just like Java has `pom.xml`, JavaScript/React has `package.json`. It lists what we need:

| Library | Why We Need It |
|---------|---------------|
| `react` | The main UI framework — lets us build interactive pages |
| `react-dom` | Connects React to the browser's HTML |
| `axios` | Makes it super easy to send HTTP requests to our Java backend |
| `vite` | A fast tool that bundles all our code into browser-ready files |

The `scripts` section defines shortcuts:

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start a development server on your laptop (with hot-reload) |
| `npm run build` | Create the final production-ready files (HTML + JS + CSS) |

---

## File 2: `index.html` — The Empty Canvas

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

This is the simplest HTML page possible. It has:
- One empty `<div>` with id "root" → React will fill this with content
- One `<script>` tag → loads our React code

**Think of it like this:** `index.html` is an empty picture frame. React is the artist that will paint inside it.

---

## File 3: `main.jsx` — Putting the Painting in the Frame

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

This one line does everything:
1. Find the empty `<div id="root">` in the HTML
2. Take our `<App />` component (the main screen)
3. Render (paint) it inside that div

---

## File 4: `App.jsx` — The Main Screen (The Important One!)

This is the heart of the frontend. Let me explain each part:

### Part A: The Backend Connection

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/tasks';
```

| Piece | Meaning |
|-------|---------|
| `import.meta.env.VITE_API_URL` | "Check if there's an environment variable called VITE_API_URL" |
| `\|\| 'http://localhost:8080/api/tasks'` | "If not, use localhost (your laptop)" |

This way, the frontend knows where to find the backend, and you can change it without editing code.

### Part B: Remembering Data (State)

```javascript
const [tasks, setTasks] = useState([]);
const [newTaskTitle, setNewTaskTitle] = useState('');
```

React uses "state" to remember things. Think of it like a whiteboard:

```
┌─────────────────────────────────────┐
│  WHITEBOARD (React State)           │
│                                     │
│  tasks = [                          │
│    { id: 1, title: "Buy milk" },    │
│    { id: 2, title: "Study Java" },  │
│  ]                                  │
│                                     │
│  newTaskTitle = "what user typed"    │
└─────────────────────────────────────┘
```

Every time you erase something on the whiteboard and write something new (`setTasks(...)`), React automatically redraws the screen to match.

### Part C: Loading Tasks When the Page Opens

```javascript
useEffect(() => {
    fetchTasks();
}, []);
```

- `useEffect` = "Run this code when something happens"
- `[]` (empty brackets) = "Only run it ONCE, when the page first opens"
- `fetchTasks()` = "Go ask the backend for all the tasks"

**In real life:** When you open a messaging app, it loads your old messages. That's what `useEffect` does here — it loads old tasks.

### Part D: Fetching Tasks from the Backend

```javascript
const fetchTasks = async () => {
    const response = await axios.get(API_URL);
    setTasks(response.data);
};
```

Step by step:
1. `axios.get(API_URL)` → Sends a message to Java: "Give me all tasks"
2. `await` → Waits for Java to respond (it takes a split second)
3. `response.data` → The response from Java is a list of tasks in JSON format
4. `setTasks(response.data)` → Writes the task list to the whiteboard → React redraws the screen

### Part E: Adding a New Task

```javascript
const addTask = async (e) => {
    e.preventDefault();
    const response = await axios.post(API_URL, {
        title: newTaskTitle,
        completed: false
    });
    setTasks([...tasks, response.data]);
    setNewTaskTitle('');
};
```

Step by step:
1. User types "Buy groceries" and clicks "Add Task"
2. `e.preventDefault()` → Stops the page from refreshing (default browser behavior)
3. `axios.post(...)` → Sends the new task to Java as JSON
4. Java saves it in PostgreSQL and sends it back with a new ID
5. `setTasks([...tasks, response.data])` → Adds the new task to the whiteboard list
6. `setNewTaskTitle('')` → Clears the text input

### Part F: Toggling Complete / Deleting

```javascript
// Toggle complete
await axios.put(`${API_URL}/${task.id}`, { ...task, completed: !task.completed });

// Delete
await axios.delete(`${API_URL}/${id}`);
```

- **Toggle:** Sends the task back to Java with `completed` flipped (true → false, false → true)
- **Delete:** Tells Java: "Delete task number 5" → Java removes it from PostgreSQL

### Part G: The HTML (What the User Sees)

```
┌──────────────────────────────────────┐
│        DevOps Task Manager           │
│                                      │
│  [What needs to be done?] [Add Task] │
│                                      │
│  ☐ Buy groceries              [Del]  │
│  ☑ Study Java (crossed out)   [Del]  │
│  ☐ Deploy to OKD              [Del]  │
└──────────────────────────────────────┘
```

The HTML is generated dynamically using `tasks.map()`:
- For each task in the list, React creates one row with a checkbox, the title, and a delete button
- If `task.completed` is true, the title gets a line through it (strikethrough)

---

## File 5: `nginx.conf` — The Web Server Rules

After we build the React app, it becomes plain HTML + JS files. We need a web server to serve them. That's Nginx.

```
User types: example.com/about
    ↓
Nginx checks: does a file called "about" exist?
    ↓
NO → Give them index.html instead
    ↓
React (inside index.html) handles the "/about" page
```

**Why?** React is a "Single Page Application" (SPA). There's only ONE real HTML file. React fakes the page changes using JavaScript. So Nginx must always fall back to `index.html`.

---

## File 6: `frontend/Dockerfile` — Packaging the React App

Same 2-stage approach as Java:

### Stage 1: Build with Node.js
```
Input:  Your .jsx source code
Tool:   Node.js + npm
Output: A "dist" folder with plain HTML, CSS, and JS files
```

### Stage 2: Serve with Nginx
```
Input:  The "dist" folder from Stage 1
Tool:   Nginx web server
Output: A tiny container that serves your website on port 80
```

**Why not keep Node.js?** 
- Node.js image = ~300 MB and has many security vulnerabilities
- Nginx image = ~20 MB and is battle-tested for serving websites
- After building, we don't need Node.js anymore, just like you don't need a bakery oven at the dinner table
