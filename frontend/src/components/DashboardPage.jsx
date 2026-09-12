import { useState, useEffect } from 'react';
import { tasksAPI, projectsAPI } from '../api/axiosConfig';

export default function DashboardPage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    tasksAPI.getAll().then(res => setTasks(res.data)).catch(console.error);
    projectsAPI.getAll().then(res => setProjects(res.data)).catch(console.error);
  }, []);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'DONE').length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;

  return (
    <>
      <div className="top-bar"><h2>🏠 Dashboard</h2></div>
      <div className="page-content">
        <div className="dashboard-welcome">
          <h2>Welcome back, {user?.name || 'User'} 👋</h2>
          <p>Here's an overview of your tasks and projects.</p>
        </div>
        <div className="stats-row">
          <div className="stat-card"><div className="stat-icon blue">📋</div><div className="stat-info"><h3>{totalTasks}</h3><p>Total Tasks</p></div></div>
          <div className="stat-card"><div className="stat-icon green">✅</div><div className="stat-info"><h3>{doneTasks}</h3><p>Completed</p></div></div>
          <div className="stat-card"><div className="stat-icon orange">📁</div><div className="stat-info"><h3>{totalProjects}</h3><p>Projects</p></div></div>
          <div className="stat-card"><div className="stat-icon red">🟢</div><div className="stat-info"><h3>{activeProjects}</h3><p>Active</p></div></div>
        </div>
        <div className="content-card" style={{marginBottom:24}}>
          <div className="card-header"><h3>Recent Tasks</h3></div>
          {tasks.length === 0 ? (<div className="empty-state"><div className="empty-icon">📝</div><p>No tasks yet</p></div>) : (
            <table className="data-table"><thead><tr><th>Title</th><th>Status</th><th>Priority</th></tr></thead><tbody>
              {tasks.slice(-5).reverse().map(t => (
                <tr key={t.id}><td><strong>{t.title}</strong></td>
                  <td><span className={`badge ${t.status==='TODO'?'todo':t.status==='IN_PROGRESS'?'in-progress':'done'}`}>{t.status==='TODO'?'To Do':t.status==='IN_PROGRESS'?'In Progress':'Done'}</span></td>
                  <td><span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span></td></tr>
              ))}</tbody></table>
          )}
        </div>
        <div className="content-card">
          <div className="card-header"><h3>Recent Projects</h3></div>
          {projects.length === 0 ? (<div className="empty-state"><div className="empty-icon">📂</div><p>No projects yet</p></div>) : (
            <table className="data-table"><thead><tr><th>Name</th><th>Status</th><th>Priority</th></tr></thead><tbody>
              {projects.slice(-5).reverse().map(p => (
                <tr key={p.id}><td><strong>{p.name}</strong></td>
                  <td><span className={`badge ${p.status==='ACTIVE'?'active':p.status==='ON_HOLD'?'on-hold':'completed'}`}>{p.status.replace('_',' ')}</span></td>
                  <td><span className={`badge ${p.priority.toLowerCase()}`}>{p.priority}</span></td></tr>
              ))}</tbody></table>
          )}
        </div>
      </div>
    </>
  );
}
