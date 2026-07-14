const Product = require('../../../../models/product');
const Cart = require('../../../../models/cart');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const CartItem = require('../../../../models/cartItem');

const mongoose = require('mongoose');
const { getById } = require('../seminar/seminar');
const cartItem = require('../../../../models/cartItem');
const ObjectId = mongoose.Types.ObjectId;

const userObj = {
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      let userId =req.user._id
      console.log('your user Id', userId);
      console.log("your User Id",userId)
      const existing = await Cart.findOne({ customerId: userId });

      console.log('existing cart', existing);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Customer Cart not found',
        });
      }
      let data = { cartId: existing._id, productId, quantity };
      const itemExist=await CartItem.findOne({productId:productId,cartId:existing._id})
      if(itemExist){
       await cartItem.findOneAndUpdate({_id:itemExist._id},{quantity:itemExist.quantity+1})
       const updatedCart=await ReturnUpdatedCart(userId)
       return  res.success({
          success: true,
          message: 'Quantity Increase',
          updatedCart
        });
      }
      const newInstance = await CartItem.create(data);

    const updatedCart=await ReturnUpdatedCart(userId)
      res.success({
        success: true,
        message: 'Product added to Cart',
        data: updatedCart,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('error ', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },
  getAll: async (req, res) => {
    try {
      let {
        page = req.query.page ? req.query.page : 1,
        pageSize = req.query.pageSize ? req.query.pageSize : 10,
        search = req.query.search ? req.query.search : null,
        column = 'createdAt',
        direction = -1,
      } = req.query;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

      const pipeline = [
        {
          $match: {
            $or: [
              { title: { $regex: search || '', $options: 'i' } }, // Case-insensitive search by name
              { subDescription: { $regex: search || '', $options: 'i' } },
              // Case-insensitive search by phone
            ],
          },
        },
        { $sort: { [column]: direction } },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await Product.aggregate(pipeline);
      const totalCount =
        resp.length > 0 && resp[0].metadata.length > 0
          ? resp[0].metadata[0].total
          : 0;
      const data = resp.length > 0 && resp[0].data ? resp[0].data : [];

      6;
      return res.success({
        data,
        totalCount,
      });
    } catch {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getById: async (req, res) => {
    try {
      const userId = req.user && req.user._id ? req.user._id : req.body.userId;
      const existing = await Product.findById(req.params.id);
      let {
        page = req.query.page ? req.query.page : 1,
        pageSize = req.query.pageSize ? req.query.pageSize : 10,
        search = req.query.search ? req.query.search : null,
        column = 'createdAt',
        direction = -1,
      } = req.query;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

      const pipeline = [
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        { $sort: { [column]: direction } },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await Product.aggregate(pipeline);
      const totalCount =
        resp.length > 0 && resp[0].metadata.length > 0
          ? resp[0].metadata[0].total
          : 0;
      const data = resp.length > 0 && resp[0].data ? resp[0].data : [];

      // if (!existing) {

      //     return res.status(404).json({
      //         message: "Product Not Found",
      //         success: false
      //     });
      // }

      res.status(200).json({
        success: true,
        data: { totalCount, data },
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  get: async (req, res) => {
    try {
      const userId = req.user && req.user._id ? req.user._id : req.body.customerId;
      console.log('hit the get cart', userId);
      const updatedCart=await ReturnUpdatedCart(userId)
      res.success({
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

module.exports = userObj;
