import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = `http://${window.location.hostname}:8081/api`;

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM' });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM' });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    try {
      if (editingTask) {
        await axios.put(`${BASE_URL}/tasks/${editingTask.id}`, { ...editingTask, ...form });
      } else {
        await axios.post(`${BASE_URL}/tasks`, form);
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const statusBadge = (status) => {
    const cls = status === 'TODO' ? 'todo' : status === 'IN_PROGRESS' ? 'in-progress' : 'done';
    const label = status === 'TODO' ? 'To Do' : status === 'IN_PROGRESS' ? 'In Progress' : 'Done';
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  const priorityBadge = (p) => {
    return <span className={`badge ${p.toLowerCase()}`}>{p}</span>;
  };

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'DONE').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const highPriority = tasks.filter(t => t.priority === 'HIGH').length;

  return (
    <>
      <div className="top-bar">
        <h2>📋 Tasks</h2>
        <div className="top-bar-actions">
          <button className="btn btn-primary" onClick={openCreate}>+ New Task</button>
        </div>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon blue">📋</div>
            <div className="stat-info"><h3>{total}</h3><p>Total Tasks</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">⏳</div>
            <div className="stat-info"><h3>{inProgress}</h3><p>In Progress</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info"><h3>{done}</h3><p>Completed</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">🔥</div>
            <div className="stat-info"><h3>{highPriority}</h3><p>High Priority</p></div>
          </div>
        </div>

        {/* Table */}
        <div className="content-card">
          <div className="card-header">
            <h3>All Tasks</h3>
          </div>
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No tasks yet. Click <strong>"+ New Task"</strong> to create one!</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td><strong>{task.title}</strong></td>
                    <td style={{color: '#888', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{task.description || '—'}</td>
                    <td>{statusBadge(task.status)}</td>
                    <td>{priorityBadge(task.priority)}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-edit" onClick={() => openEdit(task)}>✏️ Edit</button>
                        <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Enter task title" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Enter description (optional)" />
              </div>
              <div style={{display:'flex', gap: 16}}>
                <div className="form-group" style={{flex:1}}>
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div className="form-group" style={{flex:1}}>
                  <label>Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{editingTask ? 'Save Changes' : 'Create Task'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
