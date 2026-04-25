import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Bookmark, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>
      
      <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background Pattern */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'var(--primary)', opacity: 0.05, borderRadius: '0 0 0 100%' }}></div>
        
        <div style={{ 
          width: '140px', 
          height: '140px', 
          borderRadius: '50%', 
          backgroundColor: 'white', 
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          fontSize: '4rem',
          fontWeight: 900,
          border: '4px solid var(--primary)',
          boxShadow: '0 10px 30px rgba(75, 83, 32, 0.2)',
          position: 'relative',
          zIndex: 1
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1a1c12', marginBottom: '0.5rem' }}>{user?.name}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <span className="badge" style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1.5rem' }}>
            OFFICIAL {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Personal Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--primary)' }}><Mail size={20} /></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Email Address</p>
                <p style={{ fontWeight: 500 }}>{user?.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--primary)' }}><Shield size={20} /></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Role</p>
                <p style={{ fontWeight: 500, textTransform: 'capitalize' }}>{user?.role}</p>
              </div>
            </div>
            {user?.role === 'student' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--primary)' }}><Bookmark size={20} /></div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Roll Number</p>
                    <p style={{ fontWeight: 500 }}>{user?.rollNumber || 'Not assigned'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--primary)' }}><Calendar size={20} /></div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Class & Section</p>
                    <p style={{ fontWeight: 500 }}>{user?.class} - {user?.section}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Account Settings</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Manage your account security and notification preferences.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Change Password</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Update Profile Image</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start', color: 'var(--danger)', borderColor: '#fee2e2' }}>Request Deactivation</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
