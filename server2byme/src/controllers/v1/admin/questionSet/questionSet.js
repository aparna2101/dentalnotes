const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const OPTIONS = require('../../../../config/Options');
const mongoose = require('mongoose');
const { generateCreateData } = OPTIONS;
const QuestionSet = require('../../../../models/questionSet');

const questionsetOjbect = {
  createForSeminar: async (req, res) => {
    try {
      const data = req.body;
      data.seminarId = req.params.id;
      const questionSets = await QuestionSet.find({ seminarId: req.params.id }).sort({serialNumber:1});
      data.serialNumber=questionSets.length+1;

    

     const questionSet = await QuestionSet.create(data);
      return res.success({
        message: MESSAGES.apiSuccessStrings.ADDED('QuestionSet'),
        data: questionSet,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getById: async (req, res) => {
    try {
      const questionSet = await QuestionSet.find({ _id: req.params.id });
      return res.success(questionSet);
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getAllBySeminaryId: async (req, res) => {
    try {
      const seminarId = req.params.id;
      let {
        page = 1,
        pageSize = 10,
        search = null,
        column = 'createdAt',
        direction = -1,
      } = req.query;
      page = parseInt(page, 10);
      pageSize = parseInt(pageSize, 10);
      direction = parseInt(direction, 10);
      const skip = Math.max(0, page - 1) * pageSize;
      const matchStage = {
        $match: {
          ...(seminarId && {
            seminarId: new mongoose.Types.ObjectId(seminarId),
          }),
          ...(![undefined, null, ''].includes(search) && {
            $text: { $search: search },
          }),
        },
      };

      const lookupStage = {
        $lookup: {
          from: 'Question',
          localField: '_id',
          foreignField: 'questionSetId',
          as: 'questions',
        },
      };

      const sortStage = { $sort: { [column]: direction } };
      const facetStage = {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: pageSize }],
        },
      };
      const projectStage = {
        $project: {
          'questions.correctOption': 0,
        },
      };
      const pipeline = [
        matchStage,
        sortStage,
        lookupStage,
        // projectStage, commenting out the project state because this is admin route so admin should able to see the correct ans
        facetStage,
      ];
      const resp = await QuestionSet.aggregate(pipeline);
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
  getAll: async (req, res) => {
    try {
    
      let {
        page = 1,
        pageSize = 10,
        search = null,
        column = 'createdAt',
        direction = -1,
        seminarId = null
      } = req.query;
      page = parseInt(page, 10);
      pageSize = parseInt(pageSize, 10);
      direction = parseInt(direction, 10);
      const skip = Math.max(0, page - 1) * pageSize;
      const matchStage = {
        $match: {
          ...(seminarId && {
            seminarId: new mongoose.Types.ObjectId(seminarId),
          }),
          ...(![undefined, null, ''].includes(search) && {
            $text: { $search: search },
          }),
        },
      };

      const lookupStage = {
        $lookup: {
          from: 'Seminar',
          localField: 'seminarId',
          foreignField: '_id',
          as: 'seminar',
        },
      };

      const sortStage = { $sort: { [column]: direction } };
      const facetStage = {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: pageSize }],
        },
      };
      const projectStage = {
        $project: {
          seminarName: {
            $arrayElemAt: ['$seminar.name', 0],
          },
        },
      };
      const pipeline = [
        matchStage,
        sortStage,
        lookupStage,
        projectStage, 
        facetStage,
      ];
      const resp = await QuestionSet.aggregate(pipeline);
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
  changeVisibility: async (req, res) => {
    try {
      const { seminarId } = req.body;
      await QuestionSet.updateMany(
        { seminarId: seminarId },
        { $set: { isVisible: false } }
      );
      let existing = await QuestionSet.findOne({
        _id: req.params.id,
      });
      if (!existing) {
        let errors = MESSAGES.apiSuccessStrings.DATA_NOT_EXISTS('QuestionSet');
        return res.unprocessableEntity(errors);
      }
      existing.isVisible =true;
      await existing.save();
      return res.success({
        message: MESSAGES.apiSuccessStrings.UPDATE('visibility of QuestionSet'),
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  update: async (req, res) => {
    try {
      let existing = await QuestionSet.findOne({
        _id: req.params.id,
      });

      if (!existing) {
        let errors = MESSAGES.apiSuccessStrings.DATA_NOT_EXISTS('QuestionSet');
        return res.unprocessableEntity(errors);
      }

      await QuestionSet.findOneAndUpdate({ _id: req.params.id }, req.body);
      return res.success({
        message: MESSAGES.apiSuccessStrings.UPDATE('QuestionSet'),
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  delete: async (req, res) => {
    try {
      let existing = await QuestionSet.findOne({ _id: req.params.id });

    


      if (!existing) {
        let errors = MESSAGES.apiSuccessStrings.DATA_NOT_EXISTS('QuestionSet');
        return res.unprocessableEntity(errors);
      }
      await QuestionSet.findOneAndDelete({ _id: req.params.id });


      const seminarId=req.body.seminarId;
      const questionSets = await QuestionSet.find({ seminarId: seminarId}).sort({serialNumber:1});
     

      //Arranging the Serail Number if one of the Question set deleted so the question will get disturb
      questionSets.map(async(questionset,index)=>{
        if(questionset.serialNumber!==index+1){  
       await QuestionSet.findOneAndUpdate({_id:questionset._id},{serialNumber:index+1});
        }
      })




      return res.success({
        message: MESSAGES.apiSuccessStrings.DELETED('QuestionSet'),
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
};

module.exports = questionsetOjbect;
