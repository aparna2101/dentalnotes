const mongoose = require('mongoose');
const inVoiceSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        orderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order1',
        },
        totalAmount:{
            type:Number,
            
        },
        amountLeft: {
            type: Number,
        },  
        deliveredBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }  
    },
    {
        timestamps: true,
        collection: 'InVoice',
    }
);
// inVoiceSchema.index({ '$**': 'Product' });
const InVoice = mongoose.model('InVoice', inVoiceSchema);
module.exports =InVoice;