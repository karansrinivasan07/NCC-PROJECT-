const Announcement = require('../models/Announcement');

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, targetRole } = req.body;
    const announcement = new Announcement({
      title,
      content,
      postedBy: req.user.id,
      targetRole: targetRole || 'all'
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const role = req.user.role;
    let query = { targetRole: { $in: ['all', role] } };
    if (role === 'admin' || role === 'staff') {
      query = {}; // Admins and staff can see all
    }
    const announcements = await Announcement.find(query)
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
