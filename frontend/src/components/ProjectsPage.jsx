import { useState, useEffect } from 'react';
import { projectsAPI } from '../api/axiosConfig';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', status: 'ACTIVE', priority: 'MEDIUM' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
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
        await projectsAPI.update(editingProject.id, { ...editingProject, ...form });
      } else {
        await projectsAPI.create(form);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) { console.error(err); }
  };

  const deleteProject = async (id) => {
    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const statusBadge = (status) => {
    const cls = status === 'ACTIVE' ? 'active' : status === 'ON_HOLD' ? 'on-hold' : 'completed';
    return <span className={`badge ${cls}`}>{status.replace('_', ' ')}</span>;
  };

  const priorityBadge = (p) => <span className={`badge ${p.toLowerCase()}`}>{p}</span>;

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const total = projects.length;
  const active = projects.filter(p => p.status === 'ACTIVE').length;
  const onHold = projects.filter(p => p.status === 'ON_HOLD').length;
  const completed = projects.filter(p => p.status === 'COMPLETED').length;

  return (
    <>
      <div className="top-bar"><h2>📁 Projects</h2><div className="top-bar-actions"><button className="btn btn-primary" onClick={openCreate}>+ New Project</button></div></div>
      <div className="page-content">
        <div className="stats-row">
          <div className="stat-card"><div className="stat-icon blue">📁</div><div className="stat-info"><h3>{total}</h3><p>Total</p></div></div>
          <div className="stat-card"><div className="stat-icon green">🟢</div><div className="stat-info"><h3>{active}</h3><p>Active</p></div></div>
          <div className="stat-card"><div className="stat-icon orange">⏸️</div><div className="stat-info"><h3>{onHold}</h3><p>On Hold</p></div></div>
          <div className="stat-card"><div className="stat-icon red">🏁</div><div className="stat-info"><h3>{completed}</h3><p>Completed</p></div></div>
        </div>
        <div className="content-card">
          <div className="card-header">
            <h3>All Projects</h3>
            <div className="card-filters">
              <input className="search-input" type="text" placeholder="🔍 Search projects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📂</div><p>No projects found.</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Description</th><th>Status</th><th>Priority</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(project => (
                  <tr key={project.id}>
                    <td><strong>{project.name}</strong></td>
                    <td style={{color:'#888',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{project.description || '—'}</td>
                    <td>{statusBadge(project.status)}</td>
                    <td>{priorityBadge(project.priority)}</td>
                    <td><div className="action-btns">
                      <button className="btn btn-edit" onClick={() => openEdit(project)}>✏️</button>
                      <button className="btn btn-danger" onClick={() => deleteProject(project.id)}>🗑️</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Project name" /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description (optional)" /></div>
              <div style={{display:'flex',gap:16}}>
                <div className="form-group" style={{flex:1}}><label>Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="ACTIVE">Active</option><option value="ON_HOLD">On Hold</option><option value="COMPLETED">Completed</option></select></div>
                <div className="form-group" style={{flex:1}}><label>Priority</label><select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSubmit}>{editingProject ? 'Save Changes' : 'Create Project'}</button></div>
          </div>
        </div>
      )}
    </>
  );
}
