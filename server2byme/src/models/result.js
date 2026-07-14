const mongoose = require('mongoose');
const Questionset = require('./questionSet');
const resultSchema = mongoose.Schema(
  {
    seminarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seminar',
      required: false,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: false,
    },
    questionSetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Questionset',
      required: false,
    },
    status: {
      type: String,
      enum: ['PASS', 'FAIL'],
    },
    obtainMarks: {
      type: Number,
    },
    passingMarks: {
      type: Number,
      required: false,
    },
    maxScore:{
        type:Number,
        
    },
    answers:[],
  },
  {
    timestamps: true,
    collection: 'Result',
  }
);
resultSchema.index({ '$**': 'text' });
const Result = mongoose.model('Result', resultSchema);
module.exports = Result;
