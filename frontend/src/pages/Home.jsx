import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" />;
    if (user.role === 'staff') return <Navigate to="/staff-dashboard" />;
    return <Navigate to="/student-dashboard" />;
  }

  return <Navigate to="/login" />;
};

export default Home;
