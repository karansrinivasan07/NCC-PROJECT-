const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const app = express();

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is missing from environment variables!');
}

// Middleware
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Request Received`);
  next();
});
app.use(express.json());
app.use(cors());
// app.use(helmet());

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes placeholder
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/camp-events', require('./routes/campEventRoutes'));

// Health check
app.get('/', (req, res) => {
  res.send('NCC Management API is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Could not connect to MongoDB', err));
