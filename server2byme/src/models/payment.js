const mongoose = require('mongoose');
const {defaultPaymentType}=require("../config/Options")
const paymentSchema = mongoose.Schema(
    {
        inVoiceId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        employeeId: {//whose will collect the amount
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        amountRecived:{
           type:Number,
        },
        typeOfPayment: {
            type: String,
            enum:defaultPaymentType.getAllDdefaultPaymentTypeasArray()
        },
        recievedByAdminId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isPaymentRecivedByAdmin:{
            type:Boolean,
            default:false,
        },
       imageUrl:{
        type:String,
       }      
    },
    {
        timestamps: true,
        collection: 'Payment',
    }
);
// paymentSchema.index({ '$**': 'Product' });
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;