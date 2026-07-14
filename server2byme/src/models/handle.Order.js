const mongoose = require('mongoose');
const deliverySchema = mongoose.Schema(
  {
    name: {
     type:String,
    },

    orderId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order1',
  },


    vehicleNumber: {
      type: String,
    },
    deliverypartner: {
      type:String,
    },

    phoneNumber: {
      type:Number,
    },
   
  },
  {
    timestamps: true,
    collection: 'DeliveryDetail',
  }
);
// inVoiceSchema.index({ '$**': 'Product' });
const deliveryDetail = mongoose.model('DeliveryDetail', deliverySchema);
module.exports = deliveryDetail;
