const mongoose = require('mongoose');
const OPTIONS = require('../config/Options');

const familyDetailSchema = mongoose.Schema(
  {

    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    
    familyType: {
      type: String,
      enum:OPTIONS.familyTypeOptions.getAllOptions()
    },
    familyStatus: {
      type: String,
      enum:OPTIONS.familyStatusOptions.getAllOptions()
    },


    nativeState:{
      type:String,
      enum:OPTIONS.state.getAllOptions(),
      required:true,
    },

    nativeCity:{
        type:String,
        required:true,

    },

    fatherName:{
        type:String,
        required:true,
    },
    fatherOccupation: {
      type: String,
      enum:OPTIONS.fatherOccupation.getAllOptions()
    },

    motherOccupation: {
      type: String,
      enum:OPTIONS.motherOcupation.getAllOptions()
    },

    numberOfBrother:{
        type:Number,
        default:0

    },
    numberOfMarriedBrother:{
        type:Number,
        default:0
    },


    numberOfSister:{
        type:Number,
        default:0

    },
    numberOfMarriedsister:{
        type:Number,
        default:0
    },

    aboutFamily:{
        type:String,

    }
   
  },

  {
    collection: 'FamilyDetail',
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);



const FamilyDetail = mongoose.model('FamilyDetail', familyDetailSchema);

module.exports = FamilyDetail;
