import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ClipboardCheck, 
  MessageSquare, 
  FileText, 
  Target, 
  TrendingUp,
  AlertCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, annRes] = await Promise.all([
          axios.get('http://localhost:5001/api/attendance/student'),
          axios.get('http://localhost:5001/api/announcements')
        ]);
        setStats(attRes.data.stats || { total: 0, present: 0, absent: 0, percentage: 0 });
        setAnnouncements(annRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = [
    { name: 'Present', value: stats.present, color: '#15803d' },
    { name: 'Absent', value: stats.absent, color: '#991b1b' }
  ];

  if (loading) return <div>Loading cadet dashboard...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Cadet Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track your attendance and activities</p>
        </div>
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(75, 83, 32, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={20} color="var(--primary)" />
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ opacity: 0.8, fontSize: '0.875rem', fontWeight: 600 }}>Attendance Rate</span>
            <TrendingUp size={20} />
          </div>
          <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.75rem' }}>{stats.percentage}%</h2>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${stats.percentage}%`, height: '100%', background: 'white' }}></div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total Sessions</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(21, 128, 61, 0.1)', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardCheck size={18} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{stats.total}</h2>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Classes conducted</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Classes Attended</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(153, 27, 27, 0.1)', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{stats.present}</h2>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sessions you were present</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '2.5rem' }}>

        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: '1.5rem', width: '100%', textAlign: 'left', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>Digital ID Card</h3>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            {user && <QRCodeSVG value={user._id} size={160} fgColor="#1a1c12" />}
          </div>
          <p style={{ marginTop: '1.25rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Show this to mark attendance</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>Attendance Visual</h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: 700, color: '#15803d' }}>
              <div style={{ width: '12px', height: '12px', background: '#15803d', borderRadius: '3px' }}></div> Present
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: 700, color: '#991b1b' }}>
              <div style={{ width: '12px', height: '12px', background: '#991b1b', borderRadius: '3px' }}></div> Absent
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>Latest Announcements</h3>
            <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.8125rem' }}>VIEW ALL</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {announcements.length > 0 ? announcements.map((ann) => (
              <div key={ann._id} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                <div style={{ position: 'absolute', left: 0, top: '4px', bottom: '4px', width: '4px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1c12', marginBottom: '0.5rem' }}>{ann.title}</h4>
                <p style={{ fontSize: '0.9375rem', color: '#4a4d3e', marginBottom: '0.75rem', lineHeight: '1.6' }}>
                  {ann.content.length > 120 ? ann.content.substring(0, 120) + '...' : ann.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {new Date(ann.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                <MessageSquare size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No new announcements at this time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
