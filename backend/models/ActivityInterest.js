const mongoose = require('mongoose');

const activityInterestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { 
    type: String, 
    enum: ['Sports', 'Drill', 'Cultural', 'Volunteering', 'Events'], 
    required: true 
  },
  date: { type: Date, default: Date.now },
  semester: { type: String },
  academicYear: { type: String }
});

module.exports = mongoose.model('ActivityInterest', activityInterestSchema);
