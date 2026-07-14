const mongoose = require('mongoose');
// import { defaultMeasureUnit, } from '../config/Options';
const { defaultMeasureUnit } = require('../config/Options');
const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    subDescription: {
      type: String,
    },

    description: {
      type: String,
      required: false,
    },
    measureUnit: {
      type: String,
      default: defaultMeasureUnit.GRAM,
      enum: defaultMeasureUnit.getAllDefaultMeasureUnitasArray(),
    },
    unit: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    price: {
      type: Number,
      required: false,
    },
    salePrice: {
      type: Number,
      required: false,
    },

    isSale: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'Product',
  }
);
// productSchema.index({ '$**': 'Product' });
const Seminar = mongoose.model('Product', productSchema);
module.exports = Seminar;
