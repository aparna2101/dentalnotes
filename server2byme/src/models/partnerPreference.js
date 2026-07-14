const mongoose = require('mongoose');
const OPTIONS = require('../config/Options');


const partnerPreferenceSchema = mongoose.Schema(
  { 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,  // fixed typo for `require`
    },
    maritalStatus:[{
      type: String,
      enum: OPTIONS.maritalStatus.getAllOptions(),
      default: OPTIONS.maritalStatus.neverMarried,
    }],
    annualIncome: {
      type: String,
      enum: OPTIONS.annualIncomeOptions.getAllOptionAsArray(),
      default: 'Rs 3 - 4 Lakhs',  // Only one instance of annualIncome
    },
    ageFrom: {
      type: Number,
      enum: OPTIONS.ageOptions.getAllOptin(), // ensure these options are numbers if age is numeric
    },
    ageTo: {
      type: Number,
      enum: OPTIONS.ageOptions.getAllOptin(), // same as above
    },
    heightFrom: {
      type: String,
      enum: OPTIONS.heightOptions.getAllOptions(),
    },
    heightTo: {
      type: String,
      enum: OPTIONS.heightOptions.getAllOptions(),
    },
    actualHeightFrom: {
      type: Number,
    },
    actualHeightTo: {
      type: Number,
    },
    education: [{
      type: String,
      enum: OPTIONS.higestEducationOptions.getAllOptions(),
      default: 'Not Specified',
    }],
    occupation: [{
      type: String,
      enum: OPTIONS.occupationOptions.getAllOptions(),
      default: 'Not Specified',
    }],
    motherTongue: [{
      type: String,
      enum: OPTIONS.motherTongueOptions.getAllOptions(),
      default: 'Hindi/Urdu',
    }],
    city: [{
      type: String,  // Fixed typo from `Type:String`
      default: 'Not Specified',
    }],
    state: [{
      type: String,
      enum: OPTIONS.state.getAllOptions(),
      default: 'Not Specified',
    }],

    country: [{
      type: String,
      default: 'Not Specified',
    }],
    actualIncome: {
      type: Number,
      default: 3,
    }
  },
  {
    collection: 'PartnerPreference',
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

const PartnerPreference = mongoose.model('PartnerPreference', partnerPreferenceSchema);
module.exports = PartnerPreference;

