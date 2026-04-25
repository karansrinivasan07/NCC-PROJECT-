const CampEvent = require('../models/CampEvent');
const path = require('path');
const fs = require('fs');

exports.createCampEvent = async (req, res) => {
  try {
    const { name, startDate, endDate, startTime, endTime, location, description } = req.body;

    const files = (req.files || []).map(file => ({
      fileUrl: `/uploads/camps/${file.filename}`,
      fileName: file.originalname,
      fileSize: file.size
    }));

    const campEvent = new CampEvent({
      name,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      description,
      files,
      uploadedBy: req.user.id
    });

    await campEvent.save();
    res.status(201).json(campEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCampEvents = async (req, res) => {
  try {
    const events = await CampEvent.find()
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCampEvent = async (req, res) => {
  try {
    const event = await CampEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Camp/Event not found' });

    // Delete associated files from filesystem
    event.files.forEach(file => {
      const filePath = path.join(__dirname, '..', file.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await CampEvent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Camp/Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
