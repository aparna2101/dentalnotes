const mongoose = require('mongoose');
const {defaultProfileViewType}=require("../config/Options")
const ProfileViewSchema = mongoose.Schema(
    {
        profileOwner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',  // Refers to the user whose profile is being viewed
          required: true,
        },
        profileViewBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',  // Refers to the user who viewed the profile
          required: true,
        },

        expireAt: {
          type: Date,
          required: true,
          default: () => new Date(Date.now() + 10*60 * 60 * 1000), 
        },
      },   
    {
        timestamps: true,
        collection: 'ProfileView',
    }
);
// ProfileViewSchema.index({ '$**': 'Product' });
ProfileViewSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
const ProfileView = mongoose.model('ProfileView', ProfileViewSchema);
module.exports = ProfileView;