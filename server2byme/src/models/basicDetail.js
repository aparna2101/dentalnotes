const mongoose = require('mongoose');
const OPTIONS = require('../config/Options');


const BasicDetailSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },

    DOB: {
      type: String,
      required: true,
    },

    height: {
      type: String,
      enum: OPTIONS.heightOptions.getAllOptions(),
      required: true,
    },

    maritalStatus: {
      type: String,
      enum: OPTIONS.maritalStatus.getAllOptions(),
      required: true,
    },

    religion: {
      type: String,
      enum: OPTIONS.religionOptions.getAllOptions(),
      required: true,
    },

    caste: {
      type: String,
    },

    actualHeight: {
      type: Number,
      required: true,
    },

    motherTongue: {
      type: String,
      enum: OPTIONS.motherTongueOptions.getAllOptions(),
      required: true,
    },

    disable: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
    },
  },

  {
    collection: 'BasicDetail',
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

const BasicDetail = mongoose.model('BasicDetail', BasicDetailSchema);

module.exports = BasicDetail;
