const mongoose = require('mongoose');

const seminarySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    type:{
      type:String,
      enum:["SEMINAR","CLASS","LECTURE"]
    },

    college: {
      type: String,
      required: false,
    },
    dateOfSeminar: {
      type: Date,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },

    duration:{
      type:Number,
      require:false,
    }
   
  },
  {
    timestamps: true,
    collection: 'Seminar',
  }
);
seminarySchema.index({ '$**': 'Seminar' });
const Seminar = mongoose.model('Seminar', seminarySchema);
module.exports = Seminar;
