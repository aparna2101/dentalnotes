const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/JwtOptions');
const OPTIONS = require('../config/Options');
const GalleryAccess = require('./galleryAccess');

const UserSchema = mongoose.Schema(
  {
    // Identification and Authentication fields

    subscriptionInfo:{
         type:Object,

    },



    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique:true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    
    // Verification status
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },

    isPremium:{
      type:Boolean,
      default:false
    },


    recentToken:{
      type:String,
      default:null,
    },
    // Personal Information
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },

    orderId:{
      type:String,
      default:''
    },
    // gender: {
    //   type: String,
    //   enum: OPTIONS.genders.getAllOptions(),
    // },
    // age: {
    //   type: Number,
    // },
    // maritalStatus: {
    //   type: String,
    //   enum: OPTIONS.maritalStatus.getAllOptions(),
    // },
    // religion: {
    //   type: String,
    //   enum: OPTIONS.religionOptions.getAllOptions(),
    // },

    // higestEducation:{
    //   type:String,
    //   enum:OPTIONS.higestEducationOptions.getAllOptions()
    // },

    // // Location information
    // state: {
    //   type: String,
    //   enum:OPTIONS.state.getAllOptions()
    // },
    // city: {
    //   type: String,
    // },

    // country:{
    //   type:String,
      
    // },

    // height:{
    //   type:String,
    //   enum:OPTIONS.heightOptions.getAllOptions()
    // },

    // // Profile completion and introduction
    // isProfileCompleted: {
    //   type: Boolean,
    //   default: false,
    // },

    // step1: {
    //   type: Boolean,
    //   default: false,
    // },
    // step2: {
    //   type: Boolean,
    //   default: false,
    // },
    // step3: {
    //   type: Boolean,
    //   default: false,
    // },
   
    // introducation: {
    //   type: String,
    // },

    // // Status and Steps
    // status: {
    //   type: String,
    //   enum: OPTIONS.defaultStatusOFUser.getAllStatusOfUser(),
    //   default: OPTIONS.defaultStatusOFUser.ACTIVE,
    // },

    // behalfOf: {
    //   type: String,
    //   enum: OPTIONS.accountCreatedFor.getAllOptions(),
    //   required: true,
    // },

    // profileImage:{
    //   type:String,
    // },
    // image1:{
    //   type:String,
    // },
    // image2:{
    //   type:String,
    // },
    // image3:{
    //   type:String,
    // },

    // GalleryAccessType:{
    //   type:String,
    //   enum:OPTIONS.galleryAccessTypeOptions.getAllOptions(),
    //   default:OPTIONS.galleryAccessTypeOptions.askToMe,
    // },
    resetPasswordOTP: {
      type: String,
      default: null,
    },
    isDelete: {
      type: Boolean,
      required: false,
      default: false,
    },

  
    isOnline:{
      type:Boolean,
      default:false
    },
    socketId:{
      type:String,  
    }
  },
  {
    collection: 'User',
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);
UserSchema.index({ '$**': 'text' });

// Virtual for user's full name
UserSchema.virtual('name').get(function () {
  return `${this.firstName ?? ''} ${this.lastName ?? ''}`;
});

UserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

UserSchema.methods.genToken = function () {
  const payload = { id: this._id };
  return jwt.sign(payload, jwtOptions.secretOrKey, {
    algorithm: 'HS256',
    expiresIn: jwtOptions.expiry,
  });
};
UserSchema.pre('save', async function (next) {
  const user = this;
  console.log('what password setting', user.password);
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(8));
  }
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
