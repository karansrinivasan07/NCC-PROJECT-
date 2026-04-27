const mongoose = require('mongoose');
const bcryptRaw = require('bcryptjs');
const bcrypt = bcryptRaw.default || bcryptRaw;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'student'], default: 'student' },
  rollNumber: { type: String },
  class: { type: String },
  section: { type: String },
  profileImage: { type: String },
  isDeactivationRequested: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function() {
  console.log('Pre-save hook triggered for user:', this.email);
  if (!this.isModified('password')) return;
  try {
    console.log('Generating salt...');
    const salt = await bcrypt.genSalt(10);
    console.log('Hashing password...');
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
  const crypto = require('crypto');
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
