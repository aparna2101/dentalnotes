const mongoose = require('mongoose');
const OPTIONS = require('../config/Options');

const EducationAndCarrierSchema = mongoose.Schema(
  {

    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    higestEducation: {
      type: String,
      enum: OPTIONS.higestEducationOptions.getAllOptions(),
    },
    collegeInstitute: {
      type: String,
    },

    actualIncome:{
      type:Number
    }
,
    employedIn: {
      type: String,
      enum: OPTIONS.employedInOptions.getAllOptions(),
    },
    occupation: {
      type: String,
      enum: OPTIONS.occupationOptions.getAllOptions(),
    },

    isLivedWithParent: {
      type: Boolean,
      default: false,
    },
    occupationDetail: {
      type: String,
    },

    annualIncome: {
      type: String,
      enum: OPTIONS.annualIncomeOptions.getAllOptionAsArray(),
    },
  },

  {
    collection: 'EducationAndCarrier',
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

const EducationAndCarrier = mongoose.model(
  'EducationAndCarrier',
  EducationAndCarrierSchema
);

module.exports = EducationAndCarrier;
