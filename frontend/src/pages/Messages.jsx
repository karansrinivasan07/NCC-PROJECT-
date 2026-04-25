import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, Trash2, Calendar, User } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/announcements');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/announcements', { title, content, targetRole: target });
      setTitle('');
      setContent('');
      fetchMessages();
    } catch (err) {
      alert('Error posting message');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await axios.delete(`http://localhost:5001/api/announcements/${id}`);
        fetchMessages();
      } catch (err) {
        alert('Error deleting message');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Notice Board</h2>

      {(user.role === 'staff' || user.role === 'admin') && (
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <h3>Post New Announcement</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title</label>
              <input 
                className="input" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Announcement Title"
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Content</label>
              <textarea 
                className="input" 
                rows="4" 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                placeholder="Details of the announcement..."
                required
              ></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem' }}>Target:</span>
                <select className="input" style={{ width: 'auto' }} value={target} onChange={(e) => setTarget(e.target.value)}>
                  <option value="all">All</option>
                  <option value="student">Students Only</option>
                  <option value="staff">Staff Only</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                <Send size={18} />
                Post Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {messages.map((msg) => (
          <div key={msg._id} className="card" style={{ position: 'relative', overflow: 'hidden', padding: '2rem' }}>
            {/* Accent stripe */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'var(--primary)' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge" style={{ marginBottom: '1rem', background: '#fef3c7', color: '#92400e', fontWeight: 800 }}>
                  FOR: {msg.targetRole.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1c12', marginBottom: '0.75rem' }}>{msg.title}</h3>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} /> {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} /> Posted by {msg.postedBy?.name || 'Authorized Personnel'}
                  </div>
                </div>
              </div>
              {(user.role === 'admin' || user.role === 'staff') && (
                <button 
                  onClick={() => handleDelete(msg._id)}
                  style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <div style={{ 
              background: '#f8fafc', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0',
              color: '#334155',
              lineHeight: '1.8',
              fontSize: '1rem',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
            <Send size={60} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
            <h3 style={{ opacity: 0.5 }}>No Active Announcements</h3>
            <p>The notice board is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
