const mongoose = require('mongoose');

const campEventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  files: [{
    fileUrl: { type: String },
    fileName: { type: String },
    fileSize: { type: Number }
  }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CampEvent', campEventSchema);
