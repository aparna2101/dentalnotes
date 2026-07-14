const Product = require('../../../../models/product');
const Cart = require('../../../../models/cart');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const CartItem = require('../../../../models/cartItem');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const cartObj = {
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      let userId = req.user && req.user._id 
      console.log('your user Id', userId);
      const existing = await Cart.findOne({ customerId: userId });

      console.log('existing cart', existing);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Customer Cart not found',
        });
      }
      let data = { cartId: existing._id, productId, quantity };
      const newInstance = await CartItem.create(data);

    const updatedCart=await ReturnUpdatedCart(userId)
      res.status(200).json({
        success: true,
        message: 'product Added to Cart',
        data: updatedCart,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('error ', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  get: async (req, res) => {
    try {
      const userId = req.user && req.user._id ? req.user._id : req.body.customerId;
      console.log('hit the get cart', userId);
      const updatedCart=await ReturnUpdatedCart(userId)
      res.status(200).json({
        success: true,
        data:updatedCart,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },



  update: async (req, res) => {
    try {
      const {
        title,
        subDescription,
        description,
        measureUnit,
        unit,
        price,
        salePrice,
        stock,
        whatsAppNumber,
      } = req.body;
      const data = {
        title,
        subDescription,
        description,
        measureUnit,
        unit,
        price,
        salePrice,
        stock,
        whatsAppNumber,
      };

      const existing = await Product.findById(req.params.id);

      if (!existing) {
        return res.status(404).json({
          message: 'Product Not Found',
          success: false,
        });
      }

      if (req.file) {
        //upload the image on cloudinary here
        data.imageUrl = 'coudinary image path';
      }
      let updatedInstance = await Product.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Product Updated',
        data: updatedInstance,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  remove: async (req, res) => {
    try {
      let existing = await Product.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: true,
          message: 'Product Not Found',
        });
      }

      //DELETE ASSOCIATED IMAGE FROM CLOUDINARY

      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Product Deleted',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
};


 async function ReturnUpdatedCart  (userId) {
  var existing = await Cart.findOne({ customerId: userId });

  console.log("your cart on which checking",existing)

  if (!existing) {
    return false
  }
  const pipeline = [
    {
      $match: {
        cartId: new mongoose.Types.ObjectId(existing._id),
      },
    },
    {
      $lookup: {
        from: 'Product',
        localField: 'productId',
        foreignField: '_id',
        as: 'products',
      },
    },

    {
      $unwind: '$products',
    },

    {
      $project:{
        createdAt:0,
        updatedAt:0,
        __v:0,
        "products.createdAt":0,
        "products.updatedAt":0,
        "products.__v":0,
        
      }
    }
  ];

  const CartProducts = await CartItem.aggregate(pipeline);
  
let subTotal=0;
let discount=existing.discount;
let shipping=existing.shipping;
let taxes=existing.taxes;
  const updatedProduct=CartProducts.map((product)=>{
    product.totalPrice=product.quantity*product.products.price 
    subTotal+=product.quantity*product.products.price 
    return product
  });
grandTotal=subTotal-discount+shipping+taxes;
const updatedCart=await Cart.findOneAndUpdate({_id:existing._id},{discount,shipping,taxes,grandTotal,subTotal},{new:true})
 return {
    cart:updatedCart,
    products:updatedProduct
 }
 
}

cartObj.ReturnUpdatedCart=ReturnUpdatedCart;
module.exports = cartObj;