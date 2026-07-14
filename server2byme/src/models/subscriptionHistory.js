const mongoose = require('mongoose');
const SubscriptionHistorySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    orderId: {
      type: String,
    },

    spanLife: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    module: {
      type: Object,
    },

    subscriptionType: {
      type: String,
    },

    isActive:{
        type:Boolean,
        default:true
    }
  },

  {
    collection: 'SubscriptionHistory',
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

module.exports = mongoose.model('SubscriptionHistory', SubscriptionHistorySchema);
