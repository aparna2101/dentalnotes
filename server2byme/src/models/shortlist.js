const mongoose = require('mongoose');
const autoDeleteIn=process.env.TTL_ACTION_DCCUMENT
console.log("your auto Delete",autoDeleteIn)

// Schema to track shortlisted profiles
const shortlistSchema = mongoose.Schema(
  {
    shortlistedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // The user who shortlists a profile
      required: true,
    },
    shortlistedProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // The profile owner who was shortlisted
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Archived'],  // Optional: Active (current shortlist) or Archived
      default: 'Active',
    },
    expireAt:{
      type:Date,
      default: () => new Date(Date.now() + (autoDeleteIn*24)*60 * 60 * 1000),
    }
  },
  {
    collection: 'ShortlistProfile',
    timestamps: true,  // Adds createdAt and updatedAt fields automatically
  }
);

shortlistSchema.index({expireAt:1},{expireAfterSeconds:0})

const Shortlist = mongoose.model('ShortlistProfile', shortlistSchema);

module.exports = Shortlist;
