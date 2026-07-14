const mongoose = require('mongoose');// Module

// Schema to track profile GalleryAccesss
const GalleryAccessSchema = mongoose.Schema(
  {
    galleryAccessInitiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // User who is showing GalleryAccess
      required: true,
    },
    profileOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // User who received the GalleryAccess
      required: true,
    },
   
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined'],  // Status of GalleryAccess (optional)
      default: 'Pending',
    }, 

    expireAt:{
        type:Date,
        default: () => new Date(Date.now() + (5*24)*60 * 60 * 1000),
      }

  },

  {
    collection: 'GalleryAccess',
    timestamps: true,  // Adds createdAt and updatedAt fields
  }
);

GalleryAccessSchema.index({expireAt:1},{expireAfterSeconds:0})

const GalleryAccess = mongoose.model('GalleryAccess', GalleryAccessSchema);
module.exports = GalleryAccess;
