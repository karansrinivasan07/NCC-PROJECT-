const ActivityInterest = require('../models/ActivityInterest');

exports.submitInterest = async (req, res) => {
  try {
    const { activityType, semester, academicYear } = req.body;
    
    // Check if already submitted for today or some period if needed
    const interest = new ActivityInterest({
      student: req.user.id,
      activityType,
      semester,
      academicYear
    });

    await interest.save();
    res.status(201).json(interest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInterestReports = async (req, res) => {
  try {
    const reports = await ActivityInterest.aggregate([
      {
        $group: {
          _id: "$activityType",
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentInterests = async (req, res) => {
  try {
    const interests = await ActivityInterest.find({ student: req.user.id }).sort({ date: -1 });
    res.json(interests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
