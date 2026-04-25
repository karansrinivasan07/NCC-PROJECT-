import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  ClipboardCheck, 
  MessageSquare, 
  FileText, 
  Plus,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
  const [stats, setStats] = useState({ studentCount: 0, materialCount: 0, messageCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, matRes, annRes] = await Promise.all([
          axios.get('http://localhost:5001/api/auth/users'),
          axios.get('http://localhost:5001/api/materials'),
          axios.get('http://localhost:5001/api/announcements')
        ]);
        setStats({
          studentCount: usersRes.data.filter(u => u.role === 'student').length,
          materialCount: matRes.data.length,
          messageCount: annRes.data.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>Staff Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage cadets, attendance, and study materials</p>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(75, 83, 32, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <TrendingUp size={20} color="#15803d" />
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{stats.studentCount}</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Registered Cadets</p>
        </div>

        <div className="card" style={{ borderTop: '4px solid #800000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(128, 0, 0, 0.1)', color: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{stats.materialCount}</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>PDF Resources</p>
        </div>

        <div className="card" style={{ borderTop: '4px solid #000080' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0, 0, 128, 0.1)', color: '#000080', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{stats.messageCount}</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Announcements</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>Management Tools</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Link to="/attendance" className="btn btn-primary" style={{ height: '120px', flexDirection: 'column', textDecoration: 'none' }}>
              <ClipboardCheck size={28} />
              <span style={{ marginTop: '8px' }}>Attendance</span>
            </Link>
            <Link to="/messages" className="btn btn-primary" style={{ height: '120px', flexDirection: 'column', background: '#800000', textDecoration: 'none' }}>
              <Plus size={28} />
              <span style={{ marginTop: '8px' }}>New Post</span>
            </Link>
            <Link to="/materials" className="btn btn-primary" style={{ height: '120px', flexDirection: 'column', background: '#000080', textDecoration: 'none' }}>
              <FileText size={28} />
              <span style={{ marginTop: '8px' }}>Upload PDF</span>
            </Link>
            <Link to="/reports" className="btn btn-primary" style={{ height: '120px', flexDirection: 'column', background: '#475569', textDecoration: 'none' }}>
              <Users size={28} />
              <span style={{ marginTop: '8px' }}>Reports</span>
            </Link>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>System Performance</h3>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>
                <span>Cadet Attendance Rate</span>
                <span style={{ color: '#15803d' }}>85.4%</span>
              </div>
              <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px' }}>
                <div style={{ width: '85%', height: '100%', background: '#15803d', borderRadius: '5px' }}></div>
              </div>
            </div>
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>
                <span>Material Engagement</span>
                <span style={{ color: 'var(--primary)' }}>62.1%</span>
              </div>
              <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px' }}>
                <div style={{ width: '62%', height: '100%', background: 'var(--primary)', borderRadius: '5px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>
                <span>Activity Enrollment</span>
                <span style={{ color: '#000080' }}>78.0%</span>
              </div>
              <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px' }}>
                <div style={{ width: '78%', height: '100%', background: '#000080', borderRadius: '5px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
