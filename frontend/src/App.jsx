import { useState, useEffect } from 'react';
import axios from 'axios';

// Dynamically build the Backend API URL using the current browser's hostname.
// This way, if you open the app from http://192.168.1.222:3000, 
// it will call the backend at http://192.168.1.222:8080/api/tasks automatically.
// You can also override it with the VITE_API_URL environment variable at build time.
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8080/api/tasks`;

function App() {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState([]);
  // State to hold the input for a new task title
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // useEffect runs when the component mounts. We use it to fetch tasks initially.
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks from the Java backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  // Create a new task by sending a POST request to the backend
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title: newTaskTitle,
        description: "",
        completed: false
      });
      // Add the new task to the local state so the UI updates
      setTasks([...tasks, response.data]);
      setNewTaskTitle(''); // Clear input
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  // Update a task's status (completed or not)
  const toggleTask = async (task) => {
    try {
      const response = await axios.put(`${API_URL}/${task.id}`, {
        ...task,
        completed: !task.completed
      });
      // Update the local state
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  // Delete a task by sending a DELETE request to the backend
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Remove it from local state
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>DevOps Task Manager</h1>
      
      {/* Form to add a new task */}
      <form onSubmit={addTask} style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={(e) => setNewTaskTitle(e.target.value)} 
          placeholder="What needs to be done?"
          style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px 0 0 4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      {/* List of tasks */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => toggleTask(task)} 
              style={{ marginRight: '15px', cursor: 'pointer' }}
            />
            <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#888' : '#000' }}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ backgroundColor: '#FF4136', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
