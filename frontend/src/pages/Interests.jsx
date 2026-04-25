import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Target, CheckCircle2, BarChart2 } from 'lucide-react';

const Interests = () => {
  const { user } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState('');
  const [semester, setSemester] = useState('1st');
  const [myInterests, setMyInterests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const activities = ['Sports', 'Drill', 'Cultural', 'Volunteering', 'Events'];

  useEffect(() => {
    if (user.role === 'student') {
      fetchMyInterests();
    } else {
      fetchReports();
    }
  }, []);

  const fetchMyInterests = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/interests/my');
      setMyInterests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/interests/reports');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedActivity) return alert('Select an activity');
    try {
      await axios.post('http://localhost:5001/api/interests', { 
        activityType: selectedActivity,
        semester
      });
      alert('Interest submitted!');
      fetchMyInterests();
    } catch (err) {
      alert('Submission failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Activity Interests</h2>

      {user.role === 'student' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(75, 83, 32, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: '24px' }}>🎯</div>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>Express Your Interest</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Select your preferred extracurricular activity.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Available Activities</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  {activities.map(act => (
                    <div 
                      key={act}
                      onClick={() => setSelectedActivity(act)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: `2px solid ${selectedActivity === act ? 'var(--primary)' : 'var(--border)'}`,
                        backgroundColor: selectedActivity === act ? 'rgba(75, 83, 32, 0.05)' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        textAlign: 'center',
                        boxShadow: selectedActivity === act ? '0 8px 20px rgba(75, 83, 32, 0.1)' : 'none'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {selectedActivity === act && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedActivity === act ? 'var(--primary)' : '#475569' }}>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Current Semester</label>
                <select className="input" value={semester} onChange={(e) => setSemester(e.target.value)} style={{ height: '52px', fontWeight: 600 }}>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="3rd">3rd Semester</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '54px', fontSize: '1rem' }}>
                SUBMIT INTEREST APPLICATION
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={24} color="var(--primary)" /> My Submissions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myInterests.map((interest) => (
                <div key={interest._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1c12' }}>{interest.activityType}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{new Date(interest.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className="badge" style={{ background: 'var(--primary)', color: 'white' }}>SEM {interest.semester.charAt(0)}</span>
                </div>
              ))}
              {myInterests.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                  <Target size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.875rem' }}>No interests submitted yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <BarChart2 size={28} color="var(--primary)" />
            <h3>Activity Interest Report</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {activities.map(act => {
              const count = reports.find(r => r._id === act)?.count || 0;
              const total = reports.reduce((acc, r) => acc + r.count, 0) || 1;
              const percentage = ((count / total) * 100).toFixed(0);
              
              return (
                <div key={act} className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{act}</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '2rem' }}>{count}</h2>
                    <span style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>{percentage}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '1rem' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Interests;
