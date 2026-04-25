import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Settings,
  UserPlus,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, staffCount: 0, studentCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/auth/users');
        const users = res.data;
        setStats({
          totalUsers: users.length,
          staffCount: users.filter(u => u.role === 'staff').length,
          studentCount: users.filter(u => u.role === 'student').length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading Admin Panel...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>System-wide oversight and management</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ height: '48px' }}><Settings size={18} /> System Config</button>
          <button className="btn btn-primary" style={{ height: '48px' }}><UserPlus size={18} /> Add User</button>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(75, 83, 32, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <ShieldCheck size={22} />
            </div>
            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              <ArrowUpRight size={14} /> +12%
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
          <h3 style={{ margin: 0 }}>Recent User Registrations</h3>
          <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>View All Accounts</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Role</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, color: '#1a1c12' }}>Karan Srinivasan</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>ADMIN</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontSize: '0.875rem', fontWeight: 600 }}>
                    <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div> Active
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', color: '#64748b', fontSize: '0.875rem' }}>
                  Just now
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
