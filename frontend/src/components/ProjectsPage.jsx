import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = `http://${window.location.hostname}:8080/api`;

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', status: 'ACTIVE', priority: 'MEDIUM' });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/projects`);
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  const openCreate = () => {
    setEditingProject(null);
    setForm({ name: '', description: '', status: 'ACTIVE', priority: 'MEDIUM' });
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setForm({ name: project.name, description: project.description || '', status: project.status, priority: project.priority });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    try {
      if (editingProject) {
        await axios.put(`${BASE_URL}/projects/${editingProject.id}`, { ...editingProject, ...form });
      } else {
        await axios.post(`${BASE_URL}/projects`, form);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) { console.error(err); }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const statusBadge = (status) => {
    const cls = status === 'ACTIVE' ? 'active' : status === 'ON_HOLD' ? 'on-hold' : 'completed';
    return <span className={`badge ${cls}`}>{status.replace('_', ' ')}</span>;
  };

  const priorityBadge = (p) => {
    return <span className={`badge ${p.toLowerCase()}`}>{p}</span>;
  };

  const total = projects.length;
  const active = projects.filter(p => p.status === 'ACTIVE').length;
  const onHold = projects.filter(p => p.status === 'ON_HOLD').length;
  const completed = projects.filter(p => p.status === 'COMPLETED').length;

  return (
    <>
      <div className="top-bar">
        <h2>📁 Projects</h2>
        <div className="top-bar-actions">
          <button className="btn btn-primary" onClick={openCreate}>+ New Project</button>
        </div>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon blue">📁</div>
            <div className="stat-info"><h3>{total}</h3><p>Total Projects</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">🟢</div>
            <div className="stat-info"><h3>{active}</h3><p>Active</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">⏸️</div>
            <div className="stat-info"><h3>{onHold}</h3><p>On Hold</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">🏁</div>
            <div className="stat-info"><h3>{completed}</h3><p>Completed</p></div>
          </div>
        </div>

        {/* Table */}
        <div className="content-card">
          <div className="card-header">
            <h3>All Projects</h3>
          </div>
          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <p>No projects yet. Click <strong>"+ New Project"</strong> to create one!</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td><strong>{project.name}</strong></td>
                    <td style={{color: '#888', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{project.description || '—'}</td>
                    <td>{statusBadge(project.status)}</td>
                    <td>{priorityBadge(project.priority)}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-edit" onClick={() => openEdit(project)}>✏️ Edit</button>
                        <button className="btn btn-danger" onClick={() => deleteProject(project.id)}>🗑️ Delete</button>
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
              <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Enter project name" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Enter description (optional)" />
              </div>
              <div style={{display:'flex', gap: 16}}>
                <div className="form-group" style={{flex:1}}>
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
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
              <button className="btn btn-primary" onClick={handleSubmit}>{editingProject ? 'Save Changes' : 'Create Project'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
