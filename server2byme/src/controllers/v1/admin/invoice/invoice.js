const Product = require('../../../../models/product');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');

const mongoose = require('mongoose');
const { getById } = require('../seminar/seminar');
const InVoice = require('../../../../models/invoice');
const ObjectId = mongoose.Types.ObjectId;

const userObj = {
  create: async (req, res) => {
    try {
      const {
        title,
        subDescription,
        description,
        measureUnit,
        unit,
        price,
        salePrice,
      } = req.body;
      const data = {
        title,
        subDescription,
        description,
        measureUnit,
        unit,
        price,
        salePrice,
      };

      if (req.file) {
        //upload the image on cloudinary here
        data.imageUrl = 'coudinary image path';
      }
      //if user is successfully create we will send the wellcome mail to user

      //send mail logic wil here

      let newInstance = await Product.create(req.body);

      res.status(200).json({
        success: true,
        data: newInstance,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getAll: async (req, res) => {
    try {

        console.log("***your query***",req.query);
      let {
        page = 1,
        pageSize = 10,
        search = null,
        column = 'createdAt',
        direction = -1,
        amountLeft=[]
      } = req.query;

    //   console.log("Youare  array",amountLeft);
    //   console.log("Youare  array",amountLeft);

      console.log("your Query",req.query);
       const minAmountLeft = amountLeft.length > 0 ? Math.min(...amountLeft.map(Number)) : null;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

    //   let amountLeft=2000;

      const pipeline = [
         {
           $match: {
            ...(amountLeft.length > 0 && {
                amountLeft: { $gte: minAmountLeft }, // Filter records with amountLeft >= minimum value
              }),
         },
        },

        {
          $lookup: {
            from: 'User',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customerInfo',
            pipeline:[
                {
                    $project:{
                        _id:1,
                        firstName:1,
                        lastName:1,
                        imageUrl:1
                    }
                }
            ]
          },
        },

        {
          $unwind: '$customerInfo',
        },

        {
          $match: {
            $or: [
              {
                'customerInfo.firstName': {
                  $regex: search || '',
                  $options: 'i',
                },
              }, // Search in customer firstName
              {
                'customerInfo.lastName': {
                  $regex: search || '',
                  $options: 'i',
                },
              }, // Search in customer lastName
              { 'customerInfo.email': { $regex: search || '', $options: 'i' } }, // Search in customer email
            ],
          },
        },

        {

            $lookup:{
                from:"User",
                localField:"deliveredBy",
                foreignField:"_id",
                as:"employeeInfo",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            firstName:1,
                            lastName:1,
                        }
                    }
                ]
            }

        },

        {
    $unwind:"$employeeInfo"
        },

        { $sort: { [column]: direction } },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await InVoice.aggregate(pipeline);
      const totalCount =
        resp.length > 0 && resp[0].metadata.length > 0
          ? resp[0].metadata[0].total
          : 0;
      const data = resp.length > 0 && resp[0].data ? resp[0].data : [];

      return res.success({
        data,
        totalCount,
      });
    } catch (err) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('Errror', err);
    //   res.serverError(errors);
    //   throw new Error(errors);
    }
  },

  getById: async (req, res) => {


    try {

      console.log("you hitting the getById route Correct")
      const existing = await InVoice.findById(req.params.id);

      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id),  // Match by invoice ID
          },
        },
        {
          $lookup: {
            from: 'User',  // Lookup for customer information
            localField: 'customerId',
            foreignField: '_id',
            as: 'customerInfo',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  firstName: 1,
                  lastName: 1,
                  imageUrl: 1,
                  email:1,
                  address: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$customerInfo',  // Unwind customer info array
        },
        {
          $lookup: {
            from: 'Order1',  // Lookup for the order information
            localField: 'orderId',
            foreignField: '_id',
            as: 'orderInfo',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  grandTotal:1,
                  taxes:1,
                  shipping:1,
                  discount:1,
                  subTotal:1,
                  status:1,        
                  products: 1,  // Only fetching the products array
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$orderInfo',  // Unwind order info array
        },
        {
          $unwind: '$orderInfo.products',  // Unwind the products array for each product
        },
        {
          $lookup: {
            from: 'Product',  // Lookup product details for each product
            localField: 'orderInfo.products.productId',
            foreignField: '_id',
            as: 'productInfo',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  title:1,
                  productName: 1,
                  description: 1,
                  category: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$productInfo',  // Unwind product info after lookup
            preserveNullAndEmptyArrays: true,  // In case some products don't have related info
          },
        },
        {
          $group: {
            _id: "$_id",  // Group by invoice ID
            customerInfo: { $first: "$customerInfo" },  // Get the first customer info

            orderInfo: { 
              $first: { 
                _id: "$orderInfo._id", 
                products:"$orderInfo.products",
                createdAt: "$orderInfo.createdAt",
                _id: "$orderInfo._id",
                grandTotal:"$orderInfo.grandTotal",
                taxes:"$orderInfo.taxes",
                shipping:"$orderInfo.shipping",
                discount:"$orderInfo.discount",
                subTotal:"$orderInfo.subTotal",
                status:"$orderInfo.status",        
                products:"$orderInfo.products",  // Only fetching the products array
              }
            },

            products: {  // Push each product as an individual object
              $push: {
                _id: "$orderInfo.products._id",
                productId: "$orderInfo.products.productId",
                quantity: "$orderInfo.products.quantity",
                unitPrice: "$orderInfo.products.unitPrice",
                totalPrice: "$orderInfo.products.totalPrice",
                productInfo: "$productInfo",  // Include product info as a nested object
              },
            },
            invoiceFields: { $first: {
              _id: "$_id",
              createdAt: "$createdAt",
              totalAmount: "$totalAmount",
              amountLeft: "$amountLeft",
            } },  
          },
        },
      ];
      
      
      
      
      const resp = await InVoice.aggregate(pipeline);

      console.log("your respose",resp)

      if (!resp.length > 0) {
        return res.status(404).json({
          message: 'Invoice Not Found',
          success: false,
        });
      }

      res.success({
        success: true,
        data: resp[0],
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
      } = req.body;
      const data = {
        title,
        subDescription,
        description,
        measureUnit,
        unit,
        price,
        salePrice,
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
      let newInstance = await Product.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Product Updated',
        data: newInstance,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  remove: async (req, res) => {
    try {
      let existing = await InVoice.findById(req.params.id);
    console.log("your id is",req.params.id)
      console.log("your got the vincoie",existing);
      if (!existing) {
        return res.status(404).json({
          success: true,
          message: 'Invoice Not Found',
        });
      }
      //firs we will delete the associated product image from cloudinary
      await InVoice.findOneAndDelete({_id:req.params.id})
      return res.success({
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
module.exports = userObj;
