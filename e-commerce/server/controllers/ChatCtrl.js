const Chat = require('../models/Chat.model');
const User = require('../models/User.model');

const chatCtrl = {
  sendMessage: async (req, res) => {
    try {
      const { senderId, receiverId, message } = req.body;

      const newMessage = new Chat({ sender: senderId, receiver: receiverId, message });
      await newMessage.save();

      res.json({ msg: "Message sent", newMessage });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getMessages: async (req, res) => {
    try {
      const { userId1, userId2 } = req.query;
      const messages = await Chat.find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 }
        ]
      }).sort({ timestamp: 1 });

      res.json(messages);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = chatCtrl;
