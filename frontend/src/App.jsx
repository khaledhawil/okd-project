import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DashboardPage from './components/DashboardPage';
import TasksPage from './components/TasksPage';
import ProjectsPage from './components/ProjectsPage';
import ProfilePage from './components/ProfilePage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'signup'
  const [user, setUser] = useState(null);

  // On app load, check if there's a saved token in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (data) => {
    setUser({ name: data.name, email: data.email, userId: data.userId });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthPage('login');
  };

  // If user is NOT logged in, show Login or Signup page
  if (!user) {
    if (authPage === 'signup') {
      return <SignupPage onLogin={handleLogin} onSwitchToLogin={() => setAuthPage('login')} />;
    }
    return <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthPage('signup')} />;
  }

  // User IS logged in — show the main app
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const renderPage = () => {
    switch (currentPage) {
      case 'tasks':    return <TasksPage />;
      case 'projects': return <ProjectsPage />;
      case 'profile':  return <ProfilePage user={user} />;
      default:         return <DashboardPage user={user} />;
    }
  };

  return (
    <div className="app-container">
      {/* ===== SIDEBAR ===== */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>🚀 DevOps Manager</h1>
          <p>Task & Project Tracker</p>
        </div>

        {/* User Info in Sidebar */}
        <div className="sidebar-user" onClick={() => setCurrentPage('profile')}>
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-email">{user.email}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Main Menu</div>
          <div className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>
            <span className="nav-icon">🏠</span>Dashboard
          </div>
          <div className={`nav-item ${currentPage === 'tasks' ? 'active' : ''}`} onClick={() => setCurrentPage('tasks')}>
            <span className="nav-icon">📋</span>Tasks
          </div>
          <div className={`nav-item ${currentPage === 'projects' ? 'active' : ''}`} onClick={() => setCurrentPage('projects')}>
            <span className="nav-icon">📁</span>Projects
          </div>
          <div className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => setCurrentPage('profile')}>
            <span className="nav-icon">👤</span>Profile
          </div>

          <div className="nav-section-title">API Endpoints</div>
          <div className="nav-item" style={{cursor:'default',fontSize:12,color:'rgba(255,255,255,0.35)'}}>
            <span className="nav-icon">⚡</span>/api/tasks
          </div>
          <div className="nav-item" style={{cursor:'default',fontSize:12,color:'rgba(255,255,255,0.35)'}}>
            <span className="nav-icon">⚡</span>/api/projects
          </div>
          <div className="nav-item" style={{cursor:'default',fontSize:12,color:'rgba(255,255,255,0.35)'}}>
            <span className="nav-icon">🔒</span>/api/auth
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-content">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
