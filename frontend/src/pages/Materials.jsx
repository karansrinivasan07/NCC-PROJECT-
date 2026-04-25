import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  CalendarDays,
  Clock,
  MapPin,
  FileUp,
  Trash2,
  CheckCircle2,
  Upload,
  X,
  Paperclip,
  Download,
  User,
  Tent
} from 'lucide-react';

const Materials = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Form state
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Data state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/camp-events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setDescription('');
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !startDate || !endDate || !startTime || !endTime || !location) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('location', location);
    formData.append('description', description);
    files.forEach(file => formData.append('files', file));

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/camp-events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      resetForm();
      setSuccessMessage('Camp & event details uploaded successfully!');
      fetchEvents();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this camp/event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/camp-events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchEvents();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  /* ─── inline style objects ─── */
  const styles = {
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '2rem'
    },
    headerIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 4px 12px rgba(75, 83, 32, 0.25)'
    },
    successBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
      color: '#15803d',
      padding: '1rem 1.5rem',
      borderRadius: 'var(--radius)',
      marginBottom: '1.5rem',
      border: '1px solid #86efac',
      fontWeight: 600,
      fontSize: '0.9375rem',
      animation: 'slideDown 0.3s ease-out'
    },
    errorBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      color: '#991b1b',
      padding: '1rem 1.5rem',
      borderRadius: 'var(--radius)',
      marginBottom: '1.5rem',
      border: '1px solid #fca5a5',
      fontWeight: 600,
      fontSize: '0.9375rem'
    },
    formCard: {
      marginBottom: '2.5rem',
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      boxShadow: '0 4px 20px -2px rgba(75, 83, 32, 0.08)',
      padding: '2rem',
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden'
    },
    formCardAccent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)'
    },
    formTitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: 'var(--primary)',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.25rem'
    },
    fieldGroup: {
      marginBottom: '0'
    },
    fieldGroupFull: {
      gridColumn: '1 / -1',
      marginBottom: '0'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.8125rem',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    dropZone: {
      border: '2px dashed var(--border)',
      borderRadius: 'var(--radius)',
      padding: '2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: '#fafaf8'
    },
    fileChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: '#f1f5f9',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '0.375rem 0.75rem',
      fontSize: '0.8125rem',
      fontWeight: 500,
      color: '#334155',
      marginRight: '0.5rem',
      marginTop: '0.5rem'
    },
    fileChipRemove: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#94a3b8',
      padding: '0',
      display: 'flex',
      alignItems: 'center'
    },
    submitButton: {
      marginTop: '1.5rem',
      width: '100%',
      padding: '0.875rem 2rem',
      fontSize: '1rem',
      fontWeight: 700,
      letterSpacing: '0.05em'
    },
    eventCard: {
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      boxShadow: '0 4px 20px -2px rgba(75, 83, 32, 0.08)',
      padding: '1.75rem',
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease'
    },
    eventStripe: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '5px',
      height: '100%',
      background: 'linear-gradient(180deg, var(--primary) 0%, var(--accent) 100%)'
    },
    eventHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem'
    },
    eventName: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#1a1c12',
      marginBottom: '0.5rem'
    },
    eventMeta: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.25rem',
      marginBottom: '1rem'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      fontSize: '0.8125rem',
      color: '#64748b',
      fontWeight: 500
    },
    deleteBtn: {
      width: '36px',
      height: '36px',
      padding: '0',
      backgroundColor: '#fee2e2',
      color: '#ef4444',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s'
    },
    eventDescription: {
      background: '#f8fafc',
      padding: '1rem 1.25rem',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      color: '#334155',
      lineHeight: '1.7',
      fontSize: '0.9375rem',
      whiteSpace: 'pre-wrap',
      marginBottom: '1rem'
    },
    filesSection: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      paddingTop: '0.75rem',
      borderTop: '1px solid #f1f5f9'
    },
    fileLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      padding: '0.5rem 0.75rem',
      fontSize: '0.8125rem',
      fontWeight: 600,
      color: '#15803d',
      textDecoration: 'none',
      transition: 'all 0.2s'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 0',
      color: '#94a3b8'
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .camp-dropzone:hover {
          border-color: var(--primary) !important;
          background: #f5f5f0 !important;
        }
        .camp-event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px -4px rgba(75, 83, 32, 0.15);
        }
        .camp-file-link:hover {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0) !important;
          transform: translateY(-1px);
        }
        .camp-delete-btn:hover {
          background-color: #fecaca !important;
          transform: scale(1.05);
        }
      `}</style>

      {/* ─── Page Header ─── */}
      <div style={styles.pageHeader}>
        <div style={styles.headerIcon}>
          <Tent size={24} />
        </div>
        <div>
          <h2 style={{ marginBottom: '0.125rem' }}>Upload Camp & Event Details</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Create and manage NCC camps, parades, and events
          </p>
        </div>
      </div>

      {/* ─── Success Message ─── */}
      {successMessage && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={20} />
          {successMessage}
        </div>
      )}

      {/* ─── Error Message ─── */}
      {errorMessage && (
        <div style={styles.errorBanner}>
          <X size={20} />
          {errorMessage}
        </div>
      )}

      {/* ─── Upload Form (Staff/Admin only) ─── */}
      {(user.role === 'staff' || user.role === 'admin') && (
        <div style={styles.formCard}>
          <div style={styles.formCardAccent}></div>
          <h3 style={styles.formTitle}>
            <FileUp size={20} /> New Camp / Event
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              {/* Camp/Event Name */}
              <div style={styles.fieldGroupFull}>
                <label style={styles.label} htmlFor="camp-name">Camp / Event Name *</label>
                <input
                  id="camp-name"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Annual Training Camp 2026"
                  required
                />
              </div>

              {/* Start Date */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="start-date">Start Date *</label>
                <input
                  id="start-date"
                  type="date"
                  className="input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              {/* End Date */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="end-date">End Date *</label>
                <input
                  id="end-date"
                  type="date"
                  className="input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              {/* Start Time */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="start-time">Start Time *</label>
                <input
                  id="start-time"
                  type="time"
                  className="input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              {/* End Time */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="end-time">End Time *</label>
                <input
                  id="end-time"
                  type="time"
                  className="input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>

              {/* Location */}
              <div style={styles.fieldGroupFull}>
                <label style={styles.label} htmlFor="location">Location *</label>
                <input
                  id="location"
                  className="input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. NCC Training Ground, Chennai"
                  required
                />
              </div>

              {/* Description */}
              <div style={styles.fieldGroupFull}>
                <label style={styles.label} htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="input"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the camp — schedule, kit list, objectives..."
                  style={{ resize: 'vertical', minHeight: '100px' }}
                ></textarea>
              </div>

              {/* File Upload */}
              <div style={styles.fieldGroupFull}>
                <label style={styles.label}>Attachments (brochures, posters, schedules)</label>
                <div
                  className="camp-dropzone"
                  style={styles.dropZone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={28} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>
                    Click to upload files
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    PDF, Images, Docs — Max 10MB each
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFilesChange}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Selected file chips */}
                {files.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    {files.map((f, idx) => (
                      <span key={idx} style={styles.fileChip}>
                        <Paperclip size={14} />
                        {f.name}
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          ({formatFileSize(f.size)})
                        </span>
                        <button
                          type="button"
                          style={styles.fileChipRemove}
                          onClick={() => removeFile(idx)}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={styles.submitButton}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block'
                  }} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} /> Upload Camp & Event
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ─── Events List ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {events.map((evt) => (
          <div key={evt._id} className="camp-event-card" style={styles.eventCard}>
            <div style={styles.eventStripe}></div>

            <div style={styles.eventHeader}>
              <div>
                <h3 style={styles.eventName}>{evt.name}</h3>
                <div style={styles.eventMeta}>
                  <span style={styles.metaItem}>
                    <CalendarDays size={15} />
                    {formatDate(evt.startDate)} — {formatDate(evt.endDate)}
                  </span>
                  <span style={styles.metaItem}>
                    <Clock size={15} />
                    {evt.startTime} – {evt.endTime}
                  </span>
                  <span style={styles.metaItem}>
                    <MapPin size={15} />
                    {evt.location}
                  </span>
                  <span style={styles.metaItem}>
                    <User size={15} />
                    {evt.uploadedBy?.name || 'Staff'}
                  </span>
                </div>
              </div>
              {(user.role === 'admin' || user.role === 'staff') && (
                <button
                  className="camp-delete-btn"
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(evt._id)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {evt.description && (
              <div style={styles.eventDescription}>
                {evt.description}
              </div>
            )}

            {evt.files && evt.files.length > 0 && (
              <div style={styles.filesSection}>
                {evt.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={`http://localhost:5001${file.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="camp-file-link"
                    style={styles.fileLink}
                  >
                    <Download size={14} />
                    {file.fileName}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {events.length === 0 && (
          <div style={styles.emptyState}>
            <Tent size={64} style={{ opacity: 0.12, marginBottom: '1rem' }} />
            <h3 style={{ opacity: 0.5, marginBottom: '0.5rem' }}>No Camps or Events Yet</h3>
            <p>Upcoming camps and events will appear here once uploaded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;
