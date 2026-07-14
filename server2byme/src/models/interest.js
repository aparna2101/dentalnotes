const mongoose = require('mongoose');// Module


 
// Schema to track profile interests
const interestSchema = mongoose.Schema(
  {
    interestInitiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // User who is showing interest
      required: true,
    },
    profileOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // User who received the interest
      required: true,
    },
   
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined'],  // Status of interest (optional)
      default: 'Pending',
    }, 
  },

  {
    collection: 'Interest',
    timestamps: true,  // Adds createdAt and updatedAt fields
  }
);

const Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;
