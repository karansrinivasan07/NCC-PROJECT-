import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(rgba(75, 83, 32, 0.9), rgba(26, 28, 18, 0.95)), url("https://images.unsplash.com/photo-1590402444811-bfee29d1df67?auto=format&fit=crop&q=80")',
      backgroundSize: 'cover',
      padding: '1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '460px' }}
      >
        <div className="card" style={{ padding: '2.5rem', background: 'white', borderRadius: '20px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>

          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1a1c12', marginBottom: '0.75rem' }}>Forgot Password?</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {message ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ color: '#166534', background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #dcfce7' }}>
                <CheckCircle2 size={40} style={{ margin: '0 auto 1rem auto' }} />
                <p style={{ fontWeight: 600 }}>{message}</p>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ padding: '1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} /> {error}
                </div>
              )}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>EMAIL ADDRESS</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="email" 
                    className="input" 
                    placeholder="Enter your email" 
                    style={{ paddingLeft: '2.75rem', height: '50px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px', fontSize: '1rem' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
