import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Settings,
  UserPlus,
  ArrowUpRight,
  UserCheck,
  X,
  Mail,
  Lock,
  User as UserIcon,
  Shield,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, staffCount: 0, studentCount: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  // Form State for Add User
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/auth/users');
      const data = res.data;
      setUsers(data);
      setStats({
        totalUsers: data.length,
        staffCount: data.filter(u => u.role === 'staff').length,
        studentCount: data.filter(u => u.role === 'student').length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      await axios.post('http://localhost:5001/api/auth/register', formData);
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'student' });
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add user');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div>Loading Admin Panel...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>System-wide oversight and management</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-outline" 
            style={{ height: '48px' }}
            onClick={() => setShowConfigModal(true)}
          >
            <Settings size={18} /> System Config
          </button>
          <button 
            className="btn btn-primary" 
            style={{ height: '48px' }}
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(75, 83, 32, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <ShieldCheck size={22} />
            </div>
            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              <ArrowUpRight size={14} /> Live
            </span>
          </div>
          <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total Accounts</span>
          <h2 style={{ fontSize: '2rem', margin: '0.25rem 0' }}>{stats.totalUsers}</h2>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>System-wide registered users</p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #800000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(128, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#800000' }}>
              <UserCheck size={22} />
            </div>
          </div>
          <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>NCC Staff</span>
          <h2 style={{ fontSize: '2rem', margin: '0.25rem 0' }}>{stats.staffCount}</h2>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Authorized management personnel</p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #000080' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 0, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000080' }}>
              <Users size={22} />
            </div>
          </div>
          <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Active Cadets</span>
          <h2 style={{ fontSize: '2rem', margin: '0.25rem 0' }}>{stats.studentCount}</h2>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Verified student enrollments</p>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Registered Users</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Role</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, color: '#1a1c12' }}>{u.name}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', color: '#64748b', fontSize: '0.875rem' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <span className="badge" style={{ 
                      background: u.role === 'admin' ? '#dcfce7' : u.role === 'staff' ? '#fee2e2' : '#eff6ff', 
                      color: u.role === 'admin' ? '#15803d' : u.role === 'staff' ? '#991b1b' : '#1e40af' 
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontSize: '0.875rem', fontWeight: 600 }}>
                      <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card" 
              style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}
            >
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
              <h2 style={{ marginBottom: '1.5rem' }}>Add New User</h2>
              
              {formError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{formError}</p>}
              
              <form onSubmit={handleAddUser}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      className="input" 
                      style={{ paddingLeft: '2.75rem' }} 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="email"
                      className="input" 
                      style={{ paddingLeft: '2.75rem' }} 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="password"
                      className="input" 
                      style={{ paddingLeft: '2.75rem' }} 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Role</label>
                  <select 
                    className="input" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={formLoading}>
                  {formLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Config Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card" 
              style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}
            >
              <button onClick={() => setShowConfigModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
              <h2 style={{ marginBottom: '1.5rem' }}>System Configuration</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Maintenance Mode</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Disable access for all users except admins.</div>
                  <button className="btn btn-outline" style={{ marginTop: '1rem', width: '100%', borderColor: '#ef4444', color: '#ef4444' }}>Enable Now</button>
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Log Rotation</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Clear system logs older than 30 days.</div>
                  <button className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Run Cleanup</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
