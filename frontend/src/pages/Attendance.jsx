import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Check, X, Search, Calendar, Camera, List } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Attendance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [studentRecords, setStudentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [className, setClassName] = useState('CSE');
  const [section, setSection] = useState('A');
  const [scannerMode, setScannerMode] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (scannerMode && (user.role === 'staff' || user.role === 'admin')) {
      const scanner = new Html5QrcodeScanner('reader', { qrbox: { width: 250, height: 250 }, fps: 5 }, false);
      
      scanner.render(
        async (decodedText) => {
          scanner.pause();
          try {
            const res = await axios.post('http://localhost:5001/api/attendance/scan', { studentId: decodedText });
            setScanResult({ type: 'success', message: `${res.data.student.name}: ${res.data.message}` });
            fetchStudents(); 
          } catch (err) {
            setScanResult({ type: 'error', message: err.response?.data?.message || 'Scan failed. Invalid QR.' });
          }
          setTimeout(() => {
            setScanResult(null);
            scanner.resume();
          }, 3000);
        },
        (err) => {
          // ignore continuous scan errors
        }
      );

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [scannerMode]);

  useEffect(() => {
    if (user.role === 'staff' || user.role === 'admin') {
      fetchStudents();
    } else {
      fetchStudentAttendance();
    }
  }, [className, section]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/auth/users');
      const filtered = res.data.filter(u => u.role === 'student');
      setStudents(filtered);
      // Initialize attendance data
      const initial = {};
      filtered.forEach(s => initial[s._id] = 'Present');
      setAttendanceData(initial);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAttendance = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/attendance/student`);
      setStudentRecords(res.data.records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setAttendanceData({ ...attendanceData, [id]: status });
  };

  const handleSubmit = async () => {
    try {
      const payload = Object.keys(attendanceData).map(id => ({
        studentId: id,
        status: attendanceData[id],
        date,
        class: className,
        section
      }));
      await axios.post('http://localhost:5001/api/attendance/bulk', { attendanceData: payload });
      alert('Attendance marked successfully!');
    } catch (err) {
      alert('Error marking attendance');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (user.role === 'student') {
    return (
      <div>
        <h2 style={{ marginBottom: '2rem' }}>My Attendance History</h2>
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Class</th>
              </tr>
            </thead>
            <tbody>
              {studentRecords.map((rec) => (
                <tr key={rec._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(rec.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${rec.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{rec.class} {rec.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Mark Attendance</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setScannerMode(!scannerMode)}
            className="btn"
            style={{ 
              background: scannerMode ? 'var(--primary)' : 'white',
              color: scannerMode ? 'white' : 'var(--primary)',
              border: '1px solid var(--primary)',
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '0.5rem 1rem'
            }}
          >
            {scannerMode ? <List size={18} /> : <Camera size={18} />}
            {scannerMode ? 'Manual Entry' : 'QR Scanner'}
          </button>
          {!scannerMode && (
            <>
              <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
              <select className="input" value={className} onChange={(e) => setClassName(e.target.value)}>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="AI & DS">AI & DS</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Mechatronics">Mechatronics</option>
                <option value="IT">IT</option>
              </select>
              <select className="input" value={section} onChange={(e) => setSection(e.target.value)}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </>
          )}
        </div>

      </div>

      {scannerMode ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Scan Cadet Digital ID</h3>
          {scanResult && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem', 
              background: scanResult.type === 'success' ? '#dcfce7' : '#fee2e2', 
              color: scanResult.type === 'success' ? '#166534' : '#991b1b', 
              width: '100%', 
              textAlign: 'center', 
              fontWeight: 'bold' 
            }}>
              {scanResult.message}
            </div>
          )}
          <div id="reader" style={{ width: '100%', maxWidth: '500px', border: 'none', borderRadius: '16px', overflow: 'hidden' }}></div>
        </div>
      ) : (
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid var(--border)' }}>Cadet Name</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid var(--border)' }}>Roll No.</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid var(--border)' }}>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} style={{ transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, color: '#1a1c12' }}>{student.name}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', color: '#64748b' }}>{student.rollNumber || 'N/A'}</td>
                <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                    <button 
                      onClick={() => handleStatusChange(student._id, 'Present')}
                      style={{ 
                        padding: '0.5rem 1.25rem', 
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        transition: 'all 0.2s',
                        border: '2px solid #15803d',
                        backgroundColor: attendanceData[student._id] === 'Present' ? '#15803d' : 'transparent',
                        color: attendanceData[student._id] === 'Present' ? 'white' : '#15803d',
                        cursor: 'pointer',
                        minWidth: '100px'
                      }}
                    >
                      PRESENT
                    </button>
                    <button 
                      onClick={() => handleStatusChange(student._id, 'Absent')}
                      style={{ 
                        padding: '0.5rem 1.25rem', 
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        transition: 'all 0.2s',
                        border: '2px solid #991b1b',
                        backgroundColor: attendanceData[student._id] === 'Absent' ? '#991b1b' : 'transparent',
                        color: attendanceData[student._id] === 'Absent' ? 'white' : '#991b1b',
                        cursor: 'pointer',
                        minWidth: '100px'
                      }}
                    >
                      ABSENT
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '1.5rem', textAlign: 'right', background: '#f8fafc', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <Check size={18} /> Finalize Attendance
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default Attendance;
