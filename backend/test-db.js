const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const test = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ncc_management';
    console.log('Connecting to:', uri);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected!');
    
    const count = await User.countDocuments();
    console.log('User count:', count);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

test();
