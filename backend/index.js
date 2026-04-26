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

// Connect to MongoDB with improved resilience
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ncc_management';
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Could not connect to MongoDB. Error details:');
    console.error('- Message:', err.message);
    
    if (MONGODB_URI.includes('mongodb+srv')) {
      console.warn('💡 TIP: If using MongoDB Atlas, ensure your IP is whitelisted.');
    }
    
    // If Atlas fails, try local fallback if not already trying local
    if (MONGODB_URI.includes('mongodb+srv')) {
      console.log('🔄 Attempting fallback to local MongoDB...');
      try {
        await mongoose.connect('mongodb://localhost:27017/ncc_management', {
          serverSelectionTimeoutMS: 2000,
        });
        console.log('✅ Connected to LOCAL MongoDB');
      } catch (localErr) {
        console.error('❌ Local MongoDB also unreachable. Database features will be unavailable.');
      }
    }
  }
};

// Start server immediately
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API Health Check: http://localhost:${PORT}/`);
  // Initiate DB connection in background
  connectDB();
});
