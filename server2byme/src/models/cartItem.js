const mongoose = require('mongoose');
// import { defaultCartType } from '../config/Options';
const CartItemSchema = mongoose.Schema(
    {
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
        },
       
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            default: 1
        },
    },
    {
        timestamps: true,
        collection: 'CartItem',
    }
);
// cartSchema.index({ '$**': 'Product' });
const cartItem = mongoose.model('CartItem', CartItemSchema);
module.exports = cartItem;