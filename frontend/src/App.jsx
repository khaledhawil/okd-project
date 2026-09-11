import { useState } from 'react';
import DashboardPage from './components/DashboardPage';
import TasksPage from './components/TasksPage';
import ProjectsPage from './components/ProjectsPage';

function App() {
  // Controls which page is shown (instead of a router)
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'tasks':    return <TasksPage />;
      case 'projects': return <ProjectsPage />;
      default:         return <DashboardPage />;
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

        <nav className="sidebar-nav">
          <div className="nav-section-title">Main Menu</div>
          
          <div 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </div>

          <div 
            className={`nav-item ${currentPage === 'tasks' ? 'active' : ''}`}
            onClick={() => setCurrentPage('tasks')}
          >
            <span className="nav-icon">📋</span>
            Tasks
          </div>

          <div 
            className={`nav-item ${currentPage === 'projects' ? 'active' : ''}`}
            onClick={() => setCurrentPage('projects')}
          >
            <span className="nav-icon">📁</span>
            Projects
          </div>

          <div className="nav-section-title">API Endpoints</div>
          
          <div className="nav-item" style={{cursor: 'default', fontSize: 12, color: 'rgba(255,255,255,0.35)'}}>
            <span className="nav-icon">⚡</span>
            /api/tasks
          </div>
          <div className="nav-item" style={{cursor: 'default', fontSize: 12, color: 'rgba(255,255,255,0.35)'}}>
            <span className="nav-icon">⚡</span>
            /api/projects
          </div>
        </nav>

        <div className="sidebar-footer">
          <p>Built with ❤️</p>
          <p>Spring Boot + React + PostgreSQL</p>
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
