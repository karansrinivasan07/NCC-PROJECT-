const User = require('../models/User');
const Attendance = require('../models/Attendance');
const StudyMaterial = require('../models/StudyMaterial');
const ChatMessage = require('../models/ChatMessage');

exports.getGroupStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$class', count: { $sum: 1 } } }
    ]);
    
    const branches = ['CSE', 'ECE', 'AI & DS', 'Mechanical', 'Mechatronics', 'IT'];
    const formattedStats = branches.map(branch => {
      const found = stats.find(s => s._id === branch);
      return {
        _id: `B.E. ${branch}`,
        count: found ? found.count : 0
      };
    });

    res.json(formattedStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const stats = await Attendance.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedStats = stats.map(s => {
      const dateObj = new Date(s._id);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return {
        name: days[dateObj.getDay()],
        present: s.present,
        absent: s.absent
      };
    });

    res.json(formattedStats.length ? formattedStats : [
      { name: 'Mon', present: 0, absent: 0 },
      { name: 'Tue', present: 0, absent: 0 }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSummaryStats = async (req, res) => {
  try {
    const totalAttendance = await Attendance.countDocuments();
    const presentCount = await Attendance.countDocuments({ status: 'Present' });
    const avgAttendance = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    const totalMaterials = await StudyMaterial.countDocuments();
    const activeStaff = await User.countDocuments({ role: 'staff' });
    const groupMessages = await ChatMessage.countDocuments();

    res.json({
      avgAttendance: `${avgAttendance}%`,
      totalMaterials,
      activeStaff,
      groupMessages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
