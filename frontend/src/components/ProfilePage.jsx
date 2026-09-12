import { useState, useEffect } from 'react';
import { tasksAPI, projectsAPI } from '../api/axiosConfig';

export default function ProfilePage({ user }) {
  const [taskCount, setTaskCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    tasksAPI.getAll().then(res => {
      setTaskCount(res.data.length);
      setDoneCount(res.data.filter(t => t.status === 'DONE').length);
    }).catch(console.error);
    projectsAPI.getAll().then(res => setProjectCount(res.data.length)).catch(console.error);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      <div className="top-bar">
        <h2>👤 My Profile</h2>
      </div>
      <div className="page-content">
        <div className="profile-card">
          <div className="profile-avatar-large">{initials}</div>
          <h2 className="profile-name">{user?.name || 'Unknown'}</h2>
          <p className="profile-email">{user?.email || ''}</p>

          <div className="profile-stats">
            <div className="profile-stat">
              <h3>{taskCount}</h3>
              <p>Tasks</p>
            </div>
            <div className="profile-stat">
              <h3>{doneCount}</h3>
              <p>Completed</p>
            </div>
            <div className="profile-stat">
              <h3>{projectCount}</h3>
              <p>Projects</p>
            </div>
          </div>
        </div>

        <div className="content-card" style={{marginTop: 24}}>
          <div className="card-header"><h3>Account Information</h3></div>
          <table className="data-table">
            <tbody>
              <tr><td style={{fontWeight:600, width:200}}>Full Name</td><td>{user?.name}</td></tr>
              <tr><td style={{fontWeight:600}}>Email</td><td>{user?.email}</td></tr>
              <tr><td style={{fontWeight:600}}>User ID</td><td>#{user?.userId}</td></tr>
              <tr><td style={{fontWeight:600}}>Role</td><td><span className="badge active">Member</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
