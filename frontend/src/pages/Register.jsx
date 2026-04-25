import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, ShieldCheck, UserCircle, Hash, BookOpen, Layers, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNumber: '',
    className: 'CSE',
    section: 'A'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/api/auth/register', formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'student', label: 'Student', icon: User, color: '#4b5320' },
    { id: 'staff', label: 'Staff', icon: ShieldCheck, color: '#800000' },
    { id: 'admin', label: 'Admin', icon: UserCircle, color: '#000080' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4b5320 0%, #1a1c12 100%)',
      padding: '2rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Decorative Stripes */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '8px', display: 'flex' }}>
        <div style={{ flex: 1, background: '#cc0000' }}></div>
        <div style={{ flex: 1, background: '#000080' }}></div>
        <div style={{ flex: 1, background: '#87ceeb' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '500px', zIndex: 1 }}
      >
        <div className="card" style={{ 
          padding: '2.5rem', 
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <Link to="/login" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: '#4b5320', 
            textDecoration: 'none', 
            fontSize: '0.875rem', 
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#4b5320', marginBottom: '0.5rem' }}>
              Join NCC Portal
            </h1>
            <p style={{ color: '#4a4d3e', fontSize: '0.925rem' }}>
              Create your account to access the management system.
            </p>
          </div>

          {error && (
            <div style={{ 
              padding: '0.75rem', 
              background: '#fee2e2', 
              color: '#991b1b', 
              borderRadius: '8px', 
              marginBottom: '1.5rem', 
              fontSize: '0.875rem',
              textAlign: 'center',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: '#4a4d3e' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input name="name" type="text" className="input" placeholder="Cadet Name" style={{ paddingLeft: '2.75rem' }} value={formData.name} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: '#4a4d3e' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input name="email" type="email" className="input" placeholder="cadet@college.edu" style={{ paddingLeft: '2.75rem' }} value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: '#4a4d3e' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input name="password" type="password" className="input" placeholder="••••••••" style={{ paddingLeft: '2.75rem' }} value={formData.password} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: '#4a4d3e' }}>Role</label>
                <select name="role" className="input" value={formData.role} onChange={handleChange} style={{ height: '48px' }}>
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role === 'student' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: '#4a4d3e' }}>Roll Number</label>
                    <div style={{ position: 'relative' }}>
                      <Hash size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input name="rollNumber" type="text" className="input" placeholder="NCC-123" style={{ paddingLeft: '2.75rem' }} value={formData.rollNumber} onChange={handleChange} required />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: '#4a4d3e' }}>Class</label>
                    <div style={{ position: 'relative' }}>
                      <BookOpen size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <select name="className" className="input" style={{ paddingLeft: '2.75rem', height: '48px' }} value={formData.className} onChange={handleChange} required>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="AI & DS">AI & DS</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Mechatronics">Mechatronics</option>
                        <option value="IT">IT</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: '#4a4d3e' }}>Section</label>
                    <div style={{ position: 'relative' }}>
                      <Layers size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <select name="section" className="input" style={{ paddingLeft: '2.75rem', height: '48px' }} value={formData.section} onChange={handleChange} required>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn" 
              style={{ 
                width: '100%', 
                height: '50px',
                fontSize: '1rem',
                fontWeight: 700,
                background: '#4b5320',
                color: 'white',
                marginTop: '1rem',
                boxShadow: '0 4px 12px rgba(75, 83, 32, 0.3)'
              }}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Register Now'}
            </motion.button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#4a4d3e' }}>
            Already have an account? <Link to="/login" style={{ color: '#4b5320', fontWeight: 700 }}>Sign In</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
