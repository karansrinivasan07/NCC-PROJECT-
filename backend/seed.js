const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users
    await User.deleteMany({});

    // Create Admin
    const admin = new User({
      name: 'System Admin',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();

    // Create Staff
    const staff = new User({
      name: 'Maj. Vikram Singh',
      email: 'staff@college.edu',
      password: 'password123',
      role: 'staff'
    });
    await staff.save();

    // Create Student
    const student = new User({
      name: 'Cadet Rahul Kumar',
      email: 'student@college.edu',
      password: 'password123',
      role: 'student',
      rollNumber: 'NCC/2026/001',
      class: 'CSE',
      section: 'A'
    });
    await student.save();

    console.log('Seed data created successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
