const mongoose = require('mongoose');
const cartSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require:true,
        },

        isDiscountActive:{
            type:Boolean,
            default:false,
        },

        discountedSubTotal:{
            type:Number,
            default:0,
        },

        discountedGrandTotal:{
            type:Number,
            default:0
        },

        subTotal: {
            type: Number,
            default:0
        },
        discount: {
            type: Number,
            default: 0
        },
        shipping: {
            type: Number,
            default:0,
        },
        taxes: {
            type: Number,
            default:0
        },
        grandTotal:{
            type:Number,
            defaul:0
        }

    
    },
    {
        timestamps: true,
        collection: 'Cart',
    }
);
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;