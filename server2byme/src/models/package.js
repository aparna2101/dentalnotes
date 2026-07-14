const mongoose = require('mongoose');
const autoDeleteIn=process.env.TTL_ACTION_DCCUMENT
console.log("your auto Delete",autoDeleteIn)

// Schema to track shortlisted profiles
const IgnoreSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // The user who shortlists a profile
      required: true,
    },
    NumberOfNewMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // The profile owner who was shortlisted
      required: true,
    },
    NumberOfContactView:{
      type:Date,
      default: () => new Date(Date.now() + (autoDeleteIn*24)*60 * 60 * 1000),
    },
    NumberOfFamilyDetailsView:{
      type:Date,
      default: () => new Date(Date.now() + (autoDeleteIn*24)*60 * 60 * 1000),
    },
    NumberOfContactView:{
      type:Date,
      default: () => new Date(Date.now() + (autoDeleteIn*24)*60 * 60 * 1000),
    }
  },
  {
    collection: 'IgnoreProfile',
    timestamps: true,  // Adds createdAt and updatedAt fields automatically
  }
);

IgnoreSchema.index({expireAt:1},{expireAfterSeconds:0})
IgnoreSchema.index({ userId: 1, ignoreProfile: 1 });


const IgnoreProfile = mongoose.model('ignoreProfile', IgnoreSchema);
// IgnoreProfile.createIndexes({ userId: 1, ingoreProfile: 1 }); 
module.exports = IgnoreProfile;
