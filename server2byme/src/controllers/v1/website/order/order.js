const Product = require('../../../../models/product');
const Cart = require('../../../../models/cart');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const CartItem = require('../../../../models/cartItem');
const mongoose = require('mongoose');
const cartObject=require('../cart/cart')
const ObjectId = mongoose.Types.ObjectId;
const Order=require("../../../../models/order");
const { json } = require('body-parser');
const orderObj = {
  placeOrder: async (req, res) => {
    try {
    let cart=null
    let customerId=req.user? req.user._id : req.body.customerId;
    var existing=await Cart.findOne({customerId:customerId})
    if(!existing){
        return res.status(200).json({
            success:false,
            message:"Cart Not Found"
        })
    }    
    const updatedCart=await ReturnUpdatedCart(customerId);

    if(updatedCart.products.length<1){
    return res.status(401).json({
    message:"your cart is empty"
    })
    }
  
   var {order,products}=updatedCart;
   console.log("your updated cart",order)
  var{grandTotal,subTotal,taxes,discount,shipping}=order
   var newInstance=await Order.create({customerId:customerId, grandTotal,subTotal,taxes,discount,shipping,products,status:"PROCESSING"})

   //HERE NOW AFTER ORDER PLACED CLEAR ALL THE PRODUCTS FROM CART OF USER

if(newInstance){ //CHANGE THIS IN DEPLOY
  await CartItem.deleteMany({cartId:existing._id})
  cart=await ReturnUpdatedCart(customerId);//updating the after changes in cart
}
      res.status(200).json({
        success: true,
        message: 'Order got Placed',
        data: {
          order:newInstance,
          cart:cart,
        },
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('error ', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },



  cancelOrder: async (req, res) => {
    try {
    const existing=await Order.findById(req.body.orderId);

    if(!existing){
        return res.status(404).json({
            success:false,
            message:"Order Not found"
        })
    }
    if(["OUTFORDELIVERY","CANCEL","RETURN","REJECTED","DELIVER"].includes(existing.status)){
        return res.status(401).json({
            success:false,
            message:`Can't cancel Order its already ${existing.status} `
        })
    }

    existing.status="CANCEL"
    existing.save();

    return res.status(201).json({
        message:"order Cancel",
        success:true
    }) 
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },



  getAllOrder: async (req, res) => 
    {
    try {
      const customerId = req.user ? req.user._id : req.body.customerId;

      const matchStage = {
        $match: {
          customerId: new mongoose.Types.ObjectId(customerId)
        }
      };
    
      const unwindProductsStage = {
        $unwind: "$products"
      };
    
      const lookupStage = {
        $lookup: {
          from: 'Product', // Name of the products collection
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productInfo'
        }
      };
    
      const unwindProductInfoStage = {
        $unwind: "$productInfo"
      };
    
      const addFieldsStage = {
        $addFields: {
          "products.productInfo": "$productInfo"
        }
      };
    
      const groupStage = {
        $group: {
          _id: "$_id",
          customerId: { $first: "$customerId" },
          isSelfOrder: { $first: "$isSelfOrder" },
          products: { $push: "$products" },
          status: { $first: "$status" },
          subTotal: { $first: "$subTotal" },
          discount: { $first: "$discount" },
          shipping: { $first: "$shipping" },
          taxes: { $first: "$taxes" },
          grandTotal: { $first: "$grandTotal" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" }
        }
      };
    
      const pipeline = [
        matchStage,
        unwindProductsStage,
        lookupStage,
        unwindProductInfoStage,
        addFieldsStage,
        groupStage
      ];
    
      const response = await Order.aggregate(pipeline);
      console.log('Aggregation result:', response); 
      res.status(200).json({
        data:response
      })
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },


  getById: async (req, res) => 
    {
    try {
      const orderId =req.params.id;

      const matchStage = {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId)
        }
      };
    
      const unwindProductsStage = {
        $unwind: "$products"
      };
    
      const lookupStage = {
        $lookup: {
          from: 'Product', // Name of the products collection
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productInfo'
        }
      };  
      const unwindProductInfoStage = {
        $unwind: "$productInfo"
      };
      const addFieldsStage = {
        $addFields: {
          "products.productInfo": "$productInfo"
        }
      };
    
      const groupStage = {
        $group: {
          _id: "$_id",
          customerId: { $first: "$customerId" },
          isSelfOrder: { $first: "$isSelfOrder" },
          products: { $push: "$products" },
          status: { $first: "$status" },
          subTotal: { $first: "$subTotal" },
          discount: { $first: "$discount" },
          shipping: { $first: "$shipping" },
          taxes: { $first: "$taxes" },
          grandTotal: { $first: "$grandTotal" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" }
        }
      };
    
      const pipeline = [
        matchStage,
        unwindProductsStage,
        lookupStage,
        unwindProductInfoStage,
        addFieldsStage,
        groupStage
      ];
    
      const response = await Order.aggregate(pipeline);

      if(!response.length>0){

        return res.status(404).json({
          success:false,
          message:"Order Not Found"
        })

      }

      const data=response.length>0?response[0]:
      console.log('Aggregation result:', response); 
      res.status(200).json({
        data
      })
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  
};












module.exports = orderObj;





























async function ReturnUpdatedCart(userId) {

  console.log("your returnupdateCart called",userId)
  var existing = await Cart.findOne({ customerId: userId });

  console.log("********existing**********",existing)

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
  ];

  const CartProducts = await CartItem.aggregate(pipeline);

  console.log("your piplein",CartProducts)
let subTotal=0;
let discount=existing.discount;
let shipping=existing.shipping;
let taxes=existing.taxes;
  const updatedProduct=CartProducts.map((product)=>{
    product.unitPrice=product.products.price ,
    product.totalPrice=product.quantity*product.products.price 
    subTotal+=product.quantity*product.products.price 
    return product
  });
grandTotal=subTotal-discount+shipping+taxes;
const updatedCart=await Cart.findOneAndUpdate({_id:existing._id},{discount,shipping,taxes,grandTotal,subTotal},{new:true})

console.log("your order",updatedCart)
 return {
    order:updatedCart,
    products:updatedProduct
 }
 
}
