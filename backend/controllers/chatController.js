const ChatMessage = require('../models/ChatMessage');

exports.getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find()
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    console.log('Sending message - User:', req.user.id, 'Role:', req.user.role);
    console.log('Message text:', req.body.text);
    const { text } = req.body;
    const newMessage = new ChatMessage({
      sender: req.user.id,
      text,
      role: req.user.role
    });
    await newMessage.save();
    
    const populated = await ChatMessage.findById(newMessage._id).populate('sender', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
