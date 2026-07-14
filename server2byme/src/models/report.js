const mongoose = require('mongoose');
const OPTIONS=require("../config/Options")
// Enum for report reasons
const ReportReasons = [
  'Fake and Incorrect Information',
  'Photo and Person Do Not Match',
  'Not Interested in Marrying',
  'Already Engaged/Married',
  'Inappropriate Language',
  'Unwanted Message and Call',
  'Asking for Money',
  'Other'
];

const reportSchema = mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      enum: OPTIONS.reportProfileOptions.getAllOption(), // List of possible report reasons
      required: true,
    },

    
    description: {
      type: String,
      required: false,
      trim: true,  // Optional field to provide additional details
    }, 
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Resolved'],
      default: 'Pending',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,  // Optional reference to the admin who resolved the report
    },
    resolutionComment: {
      type: String,
      required: false,  // Admin's comment about how the report was resolved
      trim: true,
    },
  },
  {
    collection: 'Reports',
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// Creating the model from the schema
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
