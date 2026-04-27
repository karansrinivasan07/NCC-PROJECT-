import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Attendance from './pages/Attendance';
import Messages from './pages/Messages';
import Materials from './pages/Materials';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import GroupChat from './pages/GroupChat';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user.role === 'admin') return <Navigate to="/admin-dashboard" />;
  if (user.role === 'staff') return <Navigate to="/staff-dashboard" />;
  return <Navigate to="/student-dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/staff-dashboard" element={
            <ProtectedRoute roles={['staff']}>
              <Layout><StaffDashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/student-dashboard" element={
            <ProtectedRoute roles={['student']}>
              <Layout><StudentDashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/attendance" element={
            <ProtectedRoute roles={['admin', 'staff', 'student']}>
              <Layout><Attendance /></Layout>
            </ProtectedRoute>
          } />


          <Route path="/materials" element={
            <ProtectedRoute>
              <Layout><Materials /></Layout>
            </ProtectedRoute>
          } />


          <Route path="/reports" element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <Layout><Reports /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout><GroupChat /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
