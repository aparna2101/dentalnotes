const bcrypt = require('bcrypt');

const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const resCode = MESSAGES.resCode;
const OPTIONS = require('../../../../config/Options');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { generateCreateData } = OPTIONS;

const Seminar = require('../../../../models/seminar');

const seminaryObject = {
  getAll: async (req, res) => {
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
            ...(![undefined, null, ''].includes(search) && {
              $text: { $search: search },
            }),
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
      const resp = await Seminar.aggregate(pipeline);
      const totalCount = (resp.length > 0 && resp[0].metadata.length > 0) ? resp[0].metadata[0].total : 0;
      const data = (resp.length > 0 && resp[0].data) ? resp[0].data : [];
    
      return res.success({
        data,
        totalCount
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
  getList: async (req, res) => {
    try {
      
      const data = await Seminar.find().select('_id name')
      .sort({ [column]: 'desc' }) ;

      return res.success({
        data
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
  create: async (req, res) => {
    try {
      const data = req.body;
      await Seminar.create(data);
      return res.success({
        message: MESSAGES.apiSuccessStrings.ADDED('Seminar'),
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getById: async (req, res) => {
    try {
      const seminar = await Seminar.find({ _id: req.params.id });
      return res.success(seminar);
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  update: async (req, res) => {
    try {
      let existing = await Seminar.findOne({
        _id: req.params.id,
      });

      if (!existing) {
        let errors = MESSAGES.apiSuccessStrings.DATA_NOT_EXISTS('Seminar');
        return res.unprocessableEntity(errors);
      }

      await Seminar.findOneAndUpdate({ _id: req.params.id }, req.body);

      return res.success({
        message: MESSAGES.apiSuccessStrings.UPDATE('Seminar'),
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  delete: async (req, res) => {
    try {
      let existing = await Seminar.findOne({ _id: req.params.id });

      if (!existing) {
        let errors = MESSAGES.apiSuccessStrings.DATA_NOT_EXISTS('Seminar');
        return res.unprocessableEntity(errors);
      }

      await Seminar.findOneAndDelete({ _id: req.params.id });

      return res.success({
        message: MESSAGES.apiSuccessStrings.DELETED('Seminar'),
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
};

module.exports = seminaryObject;
