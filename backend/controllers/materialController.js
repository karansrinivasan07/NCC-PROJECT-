const StudyMaterial = require('../models/StudyMaterial');
const path = require('path');
const fs = require('fs');

exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const { title, description } = req.body;
    const material = new StudyMaterial({
      title,
      description,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      uploadedBy: req.user.id
    });

    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find()
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', material.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
