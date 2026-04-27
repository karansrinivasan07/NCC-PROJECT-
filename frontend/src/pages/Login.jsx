import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, User, ShieldCheck, UserCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'student', label: 'Student', icon: User, color: '#4b5320', bg: '#f0f2ea' },
    { id: 'staff', label: 'Staff', icon: ShieldCheck, color: '#800000', bg: '#f8eeee' },
    { id: 'admin', label: 'Admin', icon: UserCircle, color: '#000080', bg: '#eeeeff' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(rgba(75, 83, 32, 0.9), rgba(26, 28, 18, 0.95)), url("https://images.unsplash.com/photo-1590402444811-bfee29d1df67?auto=format&fit=crop&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '8px', display: 'flex' }}>
        <div style={{ flex: 1, background: '#cc0000' }}></div>
        <div style={{ flex: 1, background: '#000080' }}></div>
        <div style={{ flex: 1, background: '#87ceeb' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '460px' }}
      >
        <div className="card" style={{ 
          padding: '2.5rem', 
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          borderRadius: '20px',
          border: '1px solid rgba(75, 83, 32, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <div style={{ 
                width: '100px', 
                height: '100px', 
                margin: '0 auto',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                padding: '8px',
                border: '2px solid #4b5320'
              }}>
                <img 
                  src="/ncc_logo.png" 
                  alt="NCC Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/e/e4/NCC_Logo.png";
                  }}
                />
              </div>
            </motion.div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#4b5320', marginBottom: '0.25rem', letterSpacing: '-0.025em' }}>
              NCC Portal
            </h1>
            <p style={{ color: '#4a4d3e', fontSize: '1rem', fontWeight: 500 }}>
              National Cadet Corps Management System
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            background: '#f1f5f9', 
            padding: '5px', 
            borderRadius: '14px', 
            marginBottom: '2rem',
            position: 'relative',
            border: '1px solid #e2e8f0'
          }}>
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setActiveTab(role.id);
                  setError('');
                  setSuccessMessage('');
                }}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: activeTab === role.id ? role.color : '#64748b',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {React.createElement(role.icon, { size: 16 })}
                {role.label}
                {activeTab === role.id && (
                  <motion.div
                    layoutId="activeTabGlow"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#ffffff',
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      zIndex: -1
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <div style={{ 
                  padding: '1rem', 
                  background: '#fef2f2', 
                  color: '#dc2626', 
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1px solid #fee2e2'
                }}>
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              {successMessage && (
                <div style={{ 
                  padding: '1rem', 
                  background: '#f0fdf4', 
                  color: '#166534', 
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1px solid #dcfce7'
                }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#166534', color: 'white', display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: '12px' }}>✓</div> 
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.875rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="email" 
                      className="input" 
                      placeholder={`your.${activeTab}@college.edu`}
                      style={{ 
                        paddingLeft: '3rem',
                        height: '54px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s',
                        background: '#f8fafc'
                      }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.875rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="password" 
                      className="input" 
                      placeholder="••••••••"
                      style={{ 
                        paddingLeft: '3rem',
                        height: '54px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '1rem',
                        background: '#f8fafc'
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '0.75rem' }}>
                    <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn" 
                  style={{ 
                    width: '100%', 
                    height: '54px',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    borderRadius: '14px',
                    background: roles.find(r => r.id === activeTab).color,
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: `0 4px 14px ${roles.find(r => r.id === activeTab).color}40`
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>Sign In as {roles.find(r => r.id === activeTab).label}</>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.925rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Don't have an account?
            </p>
            <Link to="/register" style={{ 
              color: '#4b5320', 
              fontWeight: 800, 
              textDecoration: 'none', 
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Register for NCC Portal →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
