const mongoose = require('mongoose');
const {defaultOrderStatus}=require("../config/Options")
const orderSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        employeeId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isSelfOrder:{
              type:Boolean,
              default:false,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },

                quantity: {
                    type: Number
                },

                unitPrice:{
                    type:Number
                },

                totalPrice:{
                    type:Number
                }
            }

        ],
        status:{
            type:String,
            enum:defaultOrderStatus.getAllOrderStatusAsArray()
        },
        subTotal: {
            type: Number,
        },
        discount: {
            type: Number,
            default: 0
        },
        shipping: {
            type: Number,
        },
        taxes: {
            type: Number,
        },

        grandTotal:{
            type:Number
        },

       manageBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:null
       },

        deleveredBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default:null
        }
    
    },
    {
        timestamps: true,
        collection: 'Order1',
    }
);
// orderSchema.index({ '$**': 'Product' });
const Order = mongoose.model('Order1', orderSchema);
module.exports = Order;