import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  UserCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'student'] },
    { name: 'Attendance', path: '/attendance', icon: ClipboardCheck, roles: ['admin', 'staff', 'student'] },
    { name: 'Group Chat', path: '/chat', icon: MessageSquare, roles: ['admin', 'staff', 'student'] },
    { name: 'Camps & Events', path: '/materials', icon: FileText, roles: ['admin', 'staff', 'student'] },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['admin', 'staff'] },
    { name: 'Profile', path: '/profile', icon: UserCircle, roles: ['admin', 'staff', 'student'] },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <img src="/ncc_logo.png" alt="Logo" style={{ width: '60px', height: '60px', marginBottom: '1rem', background: 'white', borderRadius: '50%', padding: '5px' }} />
        <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '1px' }}>NCC PORTAL</h2>
      </div>
      
      <nav className="sidebar-nav" style={{ flex: 1 }}>
        {links.filter(link => link.roles.includes(user.role)).map((link) => (
          <NavLink 
            key={link.name} 
            to={link.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              color: isActive ? 'white' : '#cbd5e1',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              marginBottom: '0.5rem',
              transition: 'all 0.2s'
            })}
          >
            <link.icon size={20} />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={logout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1rem',
          color: '#fca5a5',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          marginTop: 'auto',
          fontSize: '1rem'
        }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
