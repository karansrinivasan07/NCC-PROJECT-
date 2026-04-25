import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Bookmark, Calendar, Camera, Loader2, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.put('http://localhost:5001/api/auth/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update local user state with new image URL
      setUser({ ...user, profileImage: res.data.profileImage });
      setMessage('Profile picture updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>
      
      {message && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          background: '#dcfce7', 
          color: '#15803d', 
          padding: '1rem', 
          borderRadius: 'var(--radius)', 
          marginBottom: '1.5rem',
          border: '1px solid #86efac',
          fontWeight: 600
        }}>
          <CheckCircle2 size={20} />
          {message}
        </div>
      )}

      <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background Pattern */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'var(--primary)', opacity: 0.05, borderRadius: '0 0 0 100%' }}></div>
        
        <div 
          onClick={handleImageClick}
          style={{ 
            width: '140px', 
            height: '140px', 
            borderRadius: '50%', 
            backgroundColor: 'white', 
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            border: '4px solid var(--primary)',
            boxShadow: '0 10px 30px rgba(75, 83, 32, 0.2)',
            position: 'relative',
            zIndex: 1,
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          {user?.profileImage ? (
            <img 
              src={`http://localhost:5001${user.profileImage}`} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <span style={{ fontSize: '4rem', fontWeight: 900 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          )}
          
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            background: 'rgba(0,0,0,0.5)', 
            padding: '4px 0', 
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            opacity: uploading ? 1 : 0,
            transition: 'opacity 0.2s'
          }} className="upload-overlay">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
          </div>
          <style>{`
            .card:hover .upload-overlay { opacity: 1 !important; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .animate-spin { animation: spin 1s linear infinite; }
          `}</style>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          style={{ display: 'none' }} 
          accept="image/*"
        />

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
            <button 
              className="btn btn-outline" 
              style={{ justifyContent: 'flex-start' }}
              onClick={handleImageClick}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Update Profile Image'}
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start', color: 'var(--danger)', borderColor: '#fee2e2' }}>Request Deactivation</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
