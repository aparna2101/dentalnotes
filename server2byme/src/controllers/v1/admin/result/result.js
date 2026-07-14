const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const OPTIONS = require('../../../../config/Options');
const mongoose = require('mongoose');
const { generateCreateData } = OPTIONS;
const Result = require('../../../../models/result');
const { Student } = require('../../../../models/student');
const ResultObject = {
  rankedStudent: async (req, res) => {
    try {
      const questionSetId = req.body.questionSetId;
      const seminarId = req.body.seminarId;
      const top = req.query.top || 3; // Dyamically decide the how much ranked student want to see in list
      let {
        page = 1,
        pageSize = 9999,
        search = null,
        column = 'obtainMarks',
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
          ...(questionSetId && {
            questionSetId: new mongoose.Types.ObjectId(questionSetId),
          }),
        },
      };
      const facetStage = {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: skip },
            { $sort: { obtainMarks: -1 } },
            { $limit: pageSize },
          ],
        },
      };

      const pipeline = [matchStage, facetStage];
      const resp = await Result.aggregate(pipeline);
      let noOfPassStudent = 0;
      let noOfFailStudent = 0;
      let percentageOfPassStudent = 0;
      let percentageOfFailStudent = 0;
      let noOfAttemptedStudent = 0;
      let noOfUnattemptedStudent = 0;
      let topStudent = [];

      resp[0].data.forEach((item, index) => {
        item.rank = index + 1;
        if (item.status == 'PASS') {
          noOfPassStudent++;
        }

        if (index < top) {
          topStudent.push(item);
        }
      });
      const totalStudent = await Student.countDocuments({
        seminarId: seminarId,
      });

      noOfFailStudent = totalStudent - noOfPassStudent;

      noOfAttemptedStudent = await Result.countDocuments({
        seminarId: seminarId,
        questionSetId: questionSetId,
      });
      noOfUnattemptedStudent = totalStudent - noOfAttemptedStudent;

      percentageOfFailStudent = (noOfFailStudent / totalStudent) * 100;
      percentageOfPassStudent = (noOfPassStudent / totalStudent) * 100;

      res.status(200).json({
        totalStudent,
        noOfAttemptedStudent,
        noOfUnattemptedStudent,
        percentageOfPassStudent,
        percentageOfFailStudent,
        noOfPassStudent,
        noOfFailStudent,
        topStudent,
      });
    } catch (error) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(error);
    }
  },
};

module.exports = ResultObject;
