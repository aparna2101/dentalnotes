const Product = require('../../../../models/product');
const Cart = require('../../../../models/cart');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const CartItem = require('../../../../models/cartItem');
const mongoose = require('mongoose');
const { getById } = require('../seminar/seminar');
const ObjectId = mongoose.Types.ObjectId;

const userObj = {
  update: async (req, res) => {
    try {
        console.log("hit the ground")
      const { quantity } = req.body;
      const existing = await CartItem.findById(req.params.id);
    console.log("Existing",existing)
      if (!existing) {
        return res.status(404).json({
          message: 'Product Not Found',
          success: false,
        });
      }
      existing.quantity=quantity;
     await existing.save()
      res.success({
        success: true,
        message: 'Quantity Updated',
        data: existing,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  remove: async (req, res) => {
    try {
      let existing = await CartItem.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: true,
          message: 'Product Not Found',
        });
      }
      await CartItem.findByIdAndDelete(req.params.id);
      return res.success({
        success: true,
        message: 'Item Remove',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
};



module.exports = userObj;
