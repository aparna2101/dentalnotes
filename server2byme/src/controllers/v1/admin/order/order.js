const Product = require('../../../../models/product');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const Cart = require('../../../../models/cart');
const Order = require('../../../../models/order');
const Invoice = require('../../../../models/invoice');
const CartItem = require('../../../../models/cartItem');
const handleOrder = require('../../../../models/handle.Order');

const mongoose = require('mongoose');
const { getById } = require('../seminar/seminar');
const OPTIONS = require('../../../../config/Options');
const ObjectId = mongoose.Types.ObjectId;

const userObj = {
  create: async (req, res) => {
    try {
      let cart = null;
      let customerId = req.body.customerId;
      let employeeId = req.user._id;
      var existing = await Cart.findOne({ customerId: employeeId });
      if (!existing) {
        return res.status(200).json({
          success: false,
          message: 'Cart Not Found',
        });
      }
      const updatedCart = await ReturnUpdatedCart(employeeId);

      if (updatedCart.products.length < 1) {
        return res.badRequest({
          message: 'your cart is empty',
        });
      }

      var { order, products } = updatedCart;
      console.log('your updated cart', order);
      var { grandTotal, subTotal, taxes, discount, shipping } = order;
      var newInstance = await Order.create({
        customerId: customerId,
        employeeId: employeeId,
        grandTotal,
        subTotal,
        taxes,
        discount,
        shipping,
        products,
        status: 'PROCESSING',
      });
      //HERE NOW AFTER ORDER PLACED CLEAR ALL THE PRODUCTS FROM CART OF USER

      if (newInstance) {
        //CHANGE THIS IN DEPLOY
        await CartItem.deleteMany({ cartId: existing._id });
        cart = await ReturnUpdatedCart(customerId); //updating the after changes in cart
      }
      res.success({
        success: true,
        message: 'Order  Placed',
        data: {
          order: newInstance,
          cart: cart,
        },
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
        page = 1,
        pageSize = 10,
        search = null,
        column = 'createdAt',
        direction = -1,
        status = [],
      } = req.query;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

      const isAdmin = req.user.role == OPTIONS.usersRoles.ADMIN;
      const userId = req.user._id;

      const pipeline = [
        {
          $match: {
            ...(isAdmin
              ? {}
              : {
                  $or: [{ manageBy: userId }, { employeeId: userId }],
                }),
            ...(status.length > 0 && {
              status: { $in: status },
            }),
          },
        },
        {
          $lookup: {
            from: 'User', // The collection you are joining with
            localField: 'customerId', // The field from the Order collection
            foreignField: '_id', // The field from the Customer collection
            as: 'customerInfo', // The name of the output array field
            pipeline: [
              {
                $project: {
                  _id: 0, // Exclude the _id field
                  firstName: 1, // Include the firstName field
                  lastName: 1, // Include the lastName field
                  imageUrl: 1,
                },
              },
            ],
          },
        },

        {
          $unwind: '$customerInfo', // To flatten the customerInfo array to a single object
        },



        {
            $lookup: {
              from: 'User', // The collection you are joining with
              localField: 'employeeId', // The field from the Order collection
              foreignField: '_id', // The field from the Customer collection
              as: 'employeeInfo', // The name of the output array field
              pipeline: [
                {
                  $project: {
                    _id: 0, // Exclude the _id field
                    firstName: 1, // Include the firstName field
                    lastName: 1, // Include the lastName field
                    imageUrl: 1,
                  },
                },
              ],
            },
          },
  
          {
            $unwind: '$employeeInfo', // To flatten the customerInfo array to a single object
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
          $project: {
            updatedAt: 0, // Exclude the updatedAt field
            __v: 0, // Exclude the __v field
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
      const resp = await Order.aggregate(pipeline);
      const totalCount =
        resp.length > 0 && resp[0].metadata.length > 0
          ? resp[0].metadata[0].total
          : 0;
      const data = resp.length > 0 && resp[0].data ? resp[0].data : [];

      return res.success({
        data,
        totalCount,
      });
    } catch (error) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      console.log('Error', error);
    }
  },
  getById: async (req, res) => {
    try {
      let {
        page = 1,
        pageSize = 10,
        search = null,
        column = 'createdAt',
        direction = -1,
      } = req.query;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id), // Replace `id` with the ID you are looking for
          },
        },
        {
          $lookup: {
            from: 'User', // The collection you are joining with
            localField: 'customerId', // The field from the Order collection
            foreignField: '_id', // The field from the Customer collection
            as: 'customerInfo', // The name of the output array field
            pipeline: [
              {
                $project: {
                  _id: 0, // Exclude the _id field
                  firstName: 1, // Include the firstName field
                  lastName: 1, // Include the lastName field
                  imageUrl: 1,
                  email: 1,
                  phoneNumber: 1,
                },
              },
            ],
          },
        },

        {
          $unwind: '$customerInfo', // To flatten the customerInfo array to a single object
        },

        {
          $lookup: {
            from: 'User', // The collection you are joining with
            localField: 'manageBy', // The field from the Order collection
            foreignField: '_id', // The field from the Customer collection
            as: 'manageByInfo', // The name of the output array field
            pipeline: [
              {
                $project: {
                  _id: 0, // Exclude the _id field
                  firstName: 1, // Include the firstName field
                  lastName: 1, // Include the lastName field
                  imageUrl: 1,
                  email: 1,
                  phoneNumber: 1,
                },
              },
            ],
          },
        },

        // {
        //     $unwind: '$manageByInfo' // To flatten the customerInfo array to a single object
        // },

        {
          $unwind: {
            path: '$manageByInfo', // Flatten the manageByInfo array
            preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
          },
        },

        {
          $lookup: {
            from: 'DeliveryDetail', // The collection you are joining with
            localField: '_id', // The field from the Order collection
            foreignField: 'orderId', // The field from the Customer collection
            as: 'deliveryDetail', // The name of the output array field
            pipeline: [
              {
                $project: {
                  _id: 0, // Exclude the _id field
                  name: 1, // Include the firstName field
                  vehicleNumber: 1, // Include the lastName field
                  phoneNumber: 1,
                },
              },
            ],
          },
        },

        {
          $unwind: {
            path: '$deliveryDetail', // Flatten the manageByInfo array
            preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
          },
        },

        {
          $unwind: '$products', // To flatten the products array
        },
        {
          $lookup: {
            from: 'Product', // The collection you are joining with
            localField: 'products.productId', // The field from the products array
            foreignField: '_id', // The field from the Product collection
            as: 'productInfo', // The name of the output array field
            pipeline: [
              {
                $project: {
                  _id: 0, // Exclude the _id field
                  title: 1, // Include the title field
                  imageUrl: 1, // Include the imageUrl field
                },
              },
            ],
          },
        },
        {
          $unwind: '$productInfo', // To flatten the productInfo array to a single object
        },

        {
          $group: {
            _id: '$_id',
            customerId: { $first: '$customerId' },
            isSelfOrder: { $first: '$isSelfOrder' },
            products: {
              $push: {
                productId: '$products.productId',
                quantity: '$products.quantity',
                unitPrice: '$products.unitPrice',
                totalPrice: '$products.totalPrice',
                productInfo: '$productInfo', // Adding productInfo details here
              },
            },
            status: { $first: '$status' },
            customerInfo: { $first: '$customerInfo' },
            manageByInfo: { $first: '$manageByInfo' },
            deliveryDetail: { $first: '$deliveryDetail' },
            subTotal: { $first: '$subTotal' },
            discount: { $first: '$discount' },
            shipping: { $first: '$shipping' },
            taxes: { $first: '$taxes' },
            grandTotal: { $first: '$grandTotal' },
            createdAt: { $first: '$createdAt' },
          },
        },

        {
          $project: {
            updatedAt: 0, // Exclude the updatedAt field
            __v: 0, // Exclude the __v field
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
      const resp = await Order.aggregate(pipeline);
      const totalCount =
        resp.length > 0 && resp[0].metadata.length > 0
          ? resp[0].metadata[0].total
          : 0;
      const data = resp.length > 0 && resp[0].data ? resp[0].data : [];

      return res.success({
        data,
        totalCount,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

 

  changeStatus: async (req, res) => {
    try {
      let existing = await Order.findById(req.params.id);
      const { status } = req.body;
      if (!existing) {
        return res.status(404).json({
          success: true,
          message: 'Order Not Found',
        });
      }

      if (existing.status == OPTIONS.defaultOrderStatus.DELIVERED) {
        //    [OPTIONS.defaultOrderStatus.CANCEL,OPTIONS.defaultOrderStatus.ACCEPTED,OPTIONS.defaultOrderStatus.ACTIVE,OPTIONS.defaultOrderStatus.PROCESSING,OPTIONS.defaultOrderStatus.REJECTED,OPTIONS.defaultOrderStatus.DELIVERED].includes()
        if (status != OPTIONS.defaultOrderStatus.RETURN) {
          return res.status(400).json({
            success: true,
            message: 'Bad Request',
          });
        }
      }

      if(status==OPTIONS.defaultOrderStatus.DELIVERED && existing.status!=OPTIONS.defaultOrderStatus.DISPATCH){
        return res.status(400).json({
            success: true,
            message: 'Dispatch Order First'
          });
      }

      if (
        existing.status === OPTIONS.defaultOrderStatus.DELIVERED ||
        (existing.status == OPTIONS.defaultOrderStatus.DELIVERED &&
          status == OPTIONS.defaultOrderStatus.CANCEL)
      ) {
        return res.status(400).json({
          success: true,
          message: 'Bad Request',
        });
      }
      const updatedInstance = await Order.findOneAndUpdate(
        { _id: req.params.id },
        { status: status },
        { new: true }
      );
      if (updatedInstance.status == OPTIONS.defaultOrderStatus.DISPATCH) {
        console.log('');
        const handleBy = await handleOrder.create({
          ...req.body.deliveryDetail,
          orderId: existing._id,
        });
        console.log('handleBy', handleBy);
      }

      if (updatedInstance.status == OPTIONS.defaultOrderStatus.DELIVERED) {
        data = {
          orderId: existing._id,
          customerId: existing.customerId,
          product: existing.products,
          totalAmount: existing.grandTotal,
          amountLeft: existing.grandTotal,
          deliveredBy: req.user._id,
        };
        const invoice = await Invoice.create(data);
        console.log('your invoice', invoice);
      }

      res.success({
        success: true,
        message: `status Updated to ${status} `,
        data: updatedInstance,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  update: async (req, res) => {
    try {
      const { manageBy } = req.body;
      let existing = await Order.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: true,
          message: 'Order Not Found',
        });
      }
      const updatedInstance = await Order.findOneAndUpdate(
        { _id: req.params.id },
        { manageBy },
        { new: true }
      );
      res.success({
        success: true,
        message: `Access Asign to Sub-Admin`,
        data: updatedInstance,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  //THIS ROUTE SHOULD BE HANDLED BY ADMIN AND SUPER ADMIN ONLY
  remove: async (req, res) => {
    try {
      let existing = await Order.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Product Not Found',
        });
      }
      //firs we will delete the associated product image from cloudinary
      await existing.remove();
      return res.status(200).json({
        success: true,
        message: 'Order Deleted',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
};
module.exports = userObj;

async function ReturnUpdatedCart(userId) {
  console.log('your returnupdateCart called', userId);
  var existing = await Cart.findOne({ customerId: userId });

  console.log('********existing**********', existing);

  if (!existing) {
    return false;
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

  console.log('your piplein', CartProducts);
  let subTotal = 0;
  let discount = existing.discount;
  let shipping = existing.shipping;
  let taxes = existing.taxes;
  const updatedProduct = CartProducts.map((product) => {
    (product.unitPrice = product.products.price),
      (product.totalPrice = product.quantity * product.products.price);
    subTotal += product.quantity * product.products.price;
    return product;
  });
  grandTotal = subTotal - discount + shipping + taxes;
  const updatedCart = await Cart.findOneAndUpdate(
    { _id: existing._id },
    { discount, shipping, taxes, grandTotal, subTotal },
    { new: true }
  );

  console.log('your order', updatedCart);
  return {
    order: updatedCart,
    products: updatedProduct,
  };
}
