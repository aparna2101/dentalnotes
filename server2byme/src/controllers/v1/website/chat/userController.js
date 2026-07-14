const bcrypt = require('bcrypt');
const User = require('../../../../models/User');
const Message = require('../../../../models/message');
const Chat = require('../../../../models/chat');
const {
  ageCalculator,
  maskContact,
  maskEmail,
  checkAccess,
  updateProfieview,
  daysLeft,
} = require('../../../../../utils/smallHelperFunctions');

const mongoose = require('mongoose');

const {
  uploadFromBuffer,
  deleteFile,
} = require('../../../../../utils/cloudinary');
const OPTIONS = require('../../../../config/Options');
const jwtOptions = require('../../../../config/JwtOptions');
const { check } = require('express-validator');
const ProfileView = require('../../../../models/profileView');

const ObjectId = mongoose.Types.ObjectId;

const userObj = {
  message: async (req, res) => {
    try {
      let {
        page = 1,
        pageSize = 9999999,
        search = null,
        column = 'createdAt',
        direction = -1,
        role = [],
      } = req.query;

      const { content } = req.body;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

      const senderId = req.user.id;
      const receiverId = new mongoose.Types.ObjectId(req.params.id);

      var chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [senderId, receiverId],
          lastMessage: content,
          lastMessageAt: Date.now(),
        });
        await chat.save();
      } else {
        // Update the chat with the latest message
        chat.lastMessage = content;
        chat.lastMessageAt = Date.now();
        await chat.save();
      }

      const newMessage = await Message.create({
        chatId: chat._id,
        content: content,
        receiver: receiverId,
        sender: senderId,
      });

      return res.success({
        data: newMessage,
       
      });
    } catch (err) {
      console.log(err);
      res.serverError(errors);
    }
  },

  getAllmessage: async (req, res) => {
    try {
      let {
        page = 1,
        pageSize = 9999999,
        search = null,
        column = 'createdAt',
        direction = -1,
        role = [],

        chatId = null,
      } = req.query;

      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
      const senderId = req.user._id;
      const receiverId = new mongoose.Types.ObjectId(req.params.id);
      if (!false) {
        var chat = await Chat.findOne({
          participants: { $all: [senderId, receiverId] },
        });
        chatId = chat?._id;
      }
      const message = await Message.find({ chatId: chatId }).sort({
        createdAt: 1,
      });

      return res.success({
        data: message,
      });
    } catch (err) {
      console.log(err);
      res.serverError(errors);
    }
  },
};

module.exports = userObj;
