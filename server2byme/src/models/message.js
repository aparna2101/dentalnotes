const mongoose = require('mongoose');
const messageSchema = mongoose.Schema(
    {
        chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },

    
    },
    {
        timestamps: true,
        collection: 'Message',
    }
);

messageSchema.index({ chatId: 1 }); // Speeds up fetching messages for a chat
messageSchema.index({ receiver: 1, isRead: 1 }); 
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;