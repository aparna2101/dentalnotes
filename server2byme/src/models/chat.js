const mongoose = require('mongoose');
const ChatSchema = mongoose.Schema(
    {
        participants: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
          ],
          lastMessage: { type: String, default: null }, // Optional: for quick previews
          lastMessageAt: { type: Date, default: Date.now }, // Helps with sorting chats
    
    },
    {
        timestamps: true,
        collection: 'Chat',
    }
);
ChatSchema.index({ participants: 1 });
const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;