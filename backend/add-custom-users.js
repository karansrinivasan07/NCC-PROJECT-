const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const addUsers = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined in .env');
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB...');

    const usersToAdd = [
      { name: 'Karan Srinivasan', email: 'karansrinivasan07@gmail.com', password: 'password123', role: 'admin' },
      { name: 'Bala', email: 'bala09@gmail.com', password: 'password123', role: 'student' }
    ];

    for (const u of usersToAdd) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const newUser = new User(u);
        await newUser.save();
        console.log(`Created user: ${u.email}`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

addUsers();
