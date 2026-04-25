import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 0',
      marginBottom: '2rem',
      borderBottom: '1px solid var(--border)'
    }}>
      <div>
        <h3 style={{ margin: 0 }}>Welcome back, {user?.name}</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Role: <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <Bell size={20} />
        </button>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          padding: '0.5rem',
          borderRadius: '2rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {user?.profileImage ? (
              <img 
                src={`http://localhost:5001${user.profileImage}`} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <User size={18} />
            )}
          </div>
          <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user?.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
