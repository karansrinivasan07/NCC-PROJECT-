import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Download, Filter } from 'lucide-react';

const Reports = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [summaryData, setSummaryData] = useState({ avgAttendance: '0%', totalMaterials: 0, activeStaff: 0, groupMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attRes, grpRes, sumRes] = await Promise.all([
        axios.get('http://localhost:5001/api/reports/attendance-stats'),
        axios.get('http://localhost:5001/api/reports/group-stats'),
        axios.get('http://localhost:5001/api/reports/summary-stats')
      ]);
      
      setAttendanceData(attRes.data);
      setGroupData(grpRes.data.map(item => ({ name: item._id || 'Unknown', count: item.count })));
      setSummaryData(sumRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>NCC Analytics & Reports</h2>
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={18} /> Export Performance Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Weekly Attendance Trend</h3>
            <Filter size={18} color="var(--text-muted)" />
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="present" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Cadet Group Distribution</h3>
            <Filter size={18} color="var(--text-muted)" />
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Summary Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', borderRight: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg. Attendance</p>
            <h2 style={{ color: 'var(--success)' }}>{summaryData.avgAttendance}</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRight: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Materials</p>
            <h2>{summaryData.totalMaterials}</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRight: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Staff</p>
            <h2>{summaryData.activeStaff}</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Group Messages</p>
            <h2 style={{ color: '#8b5cf6' }}>{summaryData.groupMessages}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
