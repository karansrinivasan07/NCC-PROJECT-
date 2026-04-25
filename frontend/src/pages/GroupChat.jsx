import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, User, Clock, Shield, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GroupChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('ncc_token');
      const res = await axios.get('http://localhost:5001/api/chat', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const token = localStorage.getItem('ncc_token');
      const res = await axios.post('http://localhost:5001/api/chat', 
        { text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchMessages();
      setNewMessage('');
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return { bg: '#fee2e2', color: '#991b1b', label: 'ADMIN' };
      case 'staff': return { bg: '#fef3c7', color: '#92400e', label: 'STAFF' };
      default: return { bg: '#dcfce7', color: '#166534', label: 'CADET' };
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1a1c12' }}>Cadet Group Chat</h2>
          <p style={{ color: '#64748b', fontSize: '0.925rem' }}>Live discussion with all units</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>Online</span>
        </div>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: '#fff' }}>
        <div 
          ref={scrollRef}
          style={{ 
            flex: 1, 
            padding: '1.5rem', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            background: '#f8fafc'
          }}
        >
          <AnimatePresence>
            {messages.map((msg) => {
              const isOwn = String(msg.sender?._id) === String(user._id);
              const badge = getRoleBadge(msg.role);
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg._id}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: isOwn ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    alignSelf: isOwn ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', padding: '0 0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                      {isOwn ? 'You' : msg.sender?.name}
                    </span>
                    <span style={{ 
                      fontSize: '0.625rem', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      background: badge.bg, 
                      color: badge.color,
                      fontWeight: 800
                    }}>
                      {badge.label}
                    </span>
                  </div>
                  
                  <div style={{ 
                    padding: '0.75rem 1.25rem', 
                    borderRadius: isOwn ? '1.25rem 1.25rem 0 1.25rem' : '1.25rem 1.25rem 1.25rem 0',
                    background: isOwn ? 'var(--primary)' : 'white',
                    color: isOwn ? 'white' : '#1e293b',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    border: isOwn ? 'none' : '1px solid #e2e8f0',
                    fontSize: '0.9375rem',
                    lineHeight: '1.5'
                  }}>
                    {msg.text}
                  </div>
                  
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem', padding: '0 0.5rem' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <form 
          onSubmit={handleSendMessage}
          style={{ 
            padding: '1.25rem', 
            background: 'white', 
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '1rem'
          }}
        >
          <input 
            type="text" 
            className="input" 
            placeholder="Type your message to the unit..."
            style={{ borderRadius: '2rem', height: '48px', paddingLeft: '1.5rem' }}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            disabled={sending || !newMessage.trim()}
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '48px', height: '48px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {sending ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
