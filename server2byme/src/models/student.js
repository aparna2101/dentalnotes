const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/JwtOptions');
// const OPTIONS = require('../config/Options');
// const { usersRoles, defaultStatus } = OPTIONS;
// const { defaultStatus, generateCloudFrontUrl,usersRoles } = require('../config/Options');
const StudentSchema = mongoose.Schema(
  {
    isDelete: {
      type: Boolean,
      required: false,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      
    },
    phone: {
      type: Number,
      required: true,
    },
   
    college:{
        type: String,
        required: false,
    },

    degree:{
        type: String,
        required: true,
    },
    branch:{
        type: String,
        required: true,
    },
    seminarId:{
        type: mongoose.Schema.Types.ObjectId,
      ref: 'Seminar',
      required: true, 
    }
    
  },
  
  {
    collection: 'Student',
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }  
);
StudentSchema.index({ '$**': 'text' });

// Virtual for user's full name
StudentSchema.virtual('fullName').get(function () {
  return `${this.firstName ?? ''} ${this.lastName ?? ''}`;
});

// UserSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   return bcrypt.compare(password, user.password);
// };

StudentSchema.methods.genToken = function () {
  const payload = { id: this._id };
  return jwt.sign(payload, jwtOptions.secretOrKey, {
    expiresIn: jwtOptions.expiry,
  });
};
// UserSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')&&!user.role=='STUDENT') {
//     user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(8));
//   }
//   next();
// });

const Student = mongoose.model('Student', StudentSchema);

exports.Student = Student;
