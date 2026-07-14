const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const OPTIONS = require('../../../../config/Options');
const mongoose = require('mongoose');
const { generateCreateData } = OPTIONS;
const Question = require('../../../../models/question');
const User  = require('../../../../models/User');
const questionsetOjbect = {
  getAllQuestionOfQuestionSet: async (req, res) => {
    try {
      let {
        page = 1,
        pageSize = 10,
        search = null,
        column = 'createdAt',
        direction = -1,
      } = req.query;

      let questionSetId = req.params.id;

      page = parseInt(page, 10);
      pageSize = parseInt(pageSize, 10);
      direction = parseInt(direction, 10);

      const skip = Math.max(0, page - 1) * pageSize;

      const matchStage = {
        $match: {
          ...(questionSetId && {
            questionSetId: new mongoose.Types.ObjectId(questionSetId),
          }),
          ...(![undefined, null, ''].includes(search) && {
            $text: { $search: search },
          }),
        },
      };

      const sortStage = { $sort: { [column]: direction } };

      const facetStage = {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: pageSize }],
        },
      };
      const pipeline = [matchStage, sortStage, facetStage];
      const resp = await Question.aggregate(pipeline);

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

  createForQuestionSet: async (req, res) => {
    try {
      const data = req.body;
      data.questionSetId = req.params.id;
      const question = await Question.create(data);

      return res.success({
        message: MESSAGES.apiSuccessStrings.ADDED('Question'),
        question: question,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getById: async (req, res) => {
    try {
      const seminar = await Question.find({ _id: req.params.id });
      return res.success(seminar);
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  update: async (req, res) => {
    try {
      let existing = await Question.findOne({
        _id: req.params.id,
      });

      if (!existing) {
        let errors = MESSAGES.apiSuccessStrings.DATA_NOT_EXISTS('Question');
        return res.unprocessableEntity(errors);
      }

      await Question.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );

      return res.success({
        message: MESSAGES.apiSuccessStrings.UPDATE('Question'),
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  delete: async (req, res) => {
    try {
      let existing = await Question.findOne({ _id: req.params.id });

      if (!existing) {
        let errors = MESSAGES.apiSuccessStrings.DATA_NOT_EXISTS('Question');
        return res.unprocessableEntity(errors);
      }

      await Question.findOneAndDelete({ _id: req.params.id });

      return res.success({
        message: MESSAGES.apiSuccessStrings.DELETED('Question'),
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
};

module.exports = questionsetOjbect;
