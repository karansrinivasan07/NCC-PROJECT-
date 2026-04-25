const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, className, section } = req.body;
    
    const attendance = new Attendance({
      student: studentId,
      date: date || new Date(),
      status,
      markedBy: req.user.id,
      class: className,
      section
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bulkMarkAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body; // Array of { studentId, status, date, class, section }
    
    const formattedData = attendanceData.map(item => ({
      student: item.studentId,
      date: item.date || new Date(),
      status: item.status,
      markedBy: req.user.id,
      class: item.class,
      section: item.section
    }));

    const records = await Attendance.insertMany(formattedData);
    res.status(201).json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    const records = await Attendance.find({ student: studentId }).sort({ date: -1 });
    
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      records,
      stats: { total, present, absent, percentage }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAttendanceStats = async (req, res) => {
  try {
    const { className, section } = req.query;
    let query = {};
    if (className) query.class = className;
    if (section) query.section = section;

    const records = await Attendance.find(query).populate('student', 'name rollNumber class section');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.scanAttendance = async (req, res) => {
  try {
    const { studentId } = req.body;
    
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Invalid Student QR Code' });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      student: studentId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existing) {
      if (existing.status === 'Present') {
        return res.status(200).json({ message: 'Attendance already marked for today.', attendance: existing, student });
      } else {
        existing.status = 'Present';
        existing.markedBy = req.user.id;
        await existing.save();
        return res.status(200).json({ message: 'Attendance updated to Present.', attendance: existing, student });
      }
    }

    const attendance = new Attendance({
      student: studentId,
      date: new Date(),
      status: 'Present',
      markedBy: req.user.id,
      class: student.class,
      section: student.section
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance marked successfully', attendance, student });
  } catch (err) {
    console.error('Scan Error:', err);
    res.status(500).json({ message: err.message });
  }
};
