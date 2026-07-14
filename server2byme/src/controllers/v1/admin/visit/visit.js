const Visit = require('../../../../models/visit');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');

const mongoose = require('mongoose');
const { getById } = require('../seminar/seminar');
const ObjectId = mongoose.Types.ObjectId;

const {
  uploadFromBuffer,
  deleteFile,
} = require('../../../../../utils/cloudinary');
const OPTIONS = require('../../../../config/Options');

const userObj = {
  create: async (req, res) => {
    try {
      console.log('Visit Create Called', req.body);
      const data = req.body;
      data.employeeId = req.user._id;

      data.position = {
        lat:parseFloat(data.lat) ,
        lng:parseFloat(data.lng) ,
      };

      console.log('your location after setting', data.location);

      console.log('your last Data', data);

      if (req.file) {
        data.imageUrl = await uploadFromBuffer(req.file.buffer);
      }
      let newInstance = await Visit.create(data);
      console.log('your data');
      res.success({
        success: true,
        message: `${data.typeOfVisit} Visit Added`,
        data: newInstance,
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
        pageSize = req.query.pageSize ? req.query.pageSize : 99999,
        search = req.query.search ? req.query.search : null,
        column = 'createdAt',
        direction = -1,
        typeOfVisit = [],
      } = req.query;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
      const isAdmin=req.user.role==OPTIONS.usersRoles.ADMIN
      const userId=req.user._id

      // console.log('your Qyer', {
      //   ...(typeOfVisit.length > 0 && {
      //     typeOfVisit: { $in: typeOfVisit },
      //   }),
      // });

      const pipeline = [
        {
          $match: {

            ...(isAdmin ? {} : { employeeId: userId }),
            ...(typeOfVisit.length > 0 && {
              typeOfVisit: { $in: typeOfVisit },
            }),
          },
        },

        {
          $lookup: {
            from: 'User',
            localField: 'employeeId',
            foreignField: '_id',
            as: 'employeeInfo',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  firstName: 1,
                  lastName: 1,
                  imageUrl: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$employeeInfo',
        },

        {
          $match: {
            $or: [
              {
                'employeeInfo.firstName': {
                  $regex: search || '',
                  $options: 'i',
                },
              }, // Search in customer firstName
              {
                'employeeInfo.lastName': {
                  $regex: search || '',
                  $options: 'i',
                },
              }, // Search in customer lastName
              { 'employeeInfo.email': { $regex: search || '', $options: 'i' } }, // Search in customer email
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
      const resp = await Visit.aggregate(pipeline);
      const totalCount =
        resp.length > 0 && resp[0].metadata.length > 0
          ? resp[0].metadata[0].total
          : 0;
      const data = resp.length > 0 && resp[0].data ? resp[0].data : [];
      return res.success({
        data,
        totalCount,
      });
    } catch (error){
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log("erro",error)
      res.serverError(errors);
      
      throw new Error(e);
    }
  },

  getAllForMap: async (req, res) => {
    try {
      let {
        page = req.query.page ? req.query.page : 1,
        pageSize = req.query.pageSize ? req.query.pageSize : 99999,
        search = req.query.search ? req.query.search : null,
        column = 'createdAt',
        startDate,
        endDate,
        direction = -1,
        typeOfVisit = [],
      } = req.query;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

      console.log("Before converting",startDate);
    

       startDate=new Date(startDate);
       endDate=new Date(endDate);

       console.log("after converting",startDate);


      console.log('your Qyer', {
        ...(typeOfVisit.length > 0 && {
          typeOfVisit: { $in: typeOfVisit },
        }),
      });

      const pipeline = [
        {
          $match: {
            ...(typeOfVisit.length > 0 && {
              typeOfVisit: { $in: typeOfVisit },
            }),

            createdAt: {
              $gte: startDate, 
              $lte: endDate,  
            },
          },

         
        },


       

        {
          $lookup: {
            from: 'User',
            localField: 'employeeId',
            foreignField: '_id',
            as: 'employeeInfo',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  firstName: 1,
                  lastName: 1,
                  email:1,
                  imageUrl: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$employeeInfo',
        },

        {
          $match: {
            $or: [
              {
                'employeeInfo.firstName': {
                  $regex: search || '',
                  $options: 'i',
                },
              }, // Search in customer firstName
              {
                'employeeInfo.lastName': {
                  $regex: search || '',
                  $options: 'i',
                },
              }, // Search in customer lastName
              { 'employeeInfo.email': { $regex: search || '', $options: 'i' } }, // Search in customer email
            ],
          },
        },


        {
          $project:{
              _id:1,
              employeeId:1,
              customerName:1,
              typeOfVisit:1,
              employeeInfo:1,
              position:1,
              createdAt:1,
          }
        },

        { $sort: { [column]: direction } },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await Visit.aggregate(pipeline);
      const totalCount =
        resp.length > 0 && resp[0].metadata.length > 0
          ? resp[0].metadata[0].total
          : 0;
      const data = resp.length > 0 && resp[0].data ? resp[0].data : [];
      return res.success({
        data,
        totalCount,
      });
    } catch(e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getById: async (req, res) => {
    try {
      const existing = await Visit.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          message: 'Visit Not Found',
          success: false,
        });
      }

      res.status(200).json({
        success: true,
        data: existing,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  update: async (req, res) => {
    try {
      const { PhoneNumber, ownerName, shopName, location } = req.body;
      const data = { PhoneNumber, ownerName, shopName, location };

      const existing = await Visit.findById(req.params.id);

      if (!existing) {
        return res.status(404).json({
          message: 'Visit Not Found',
          success: false,
        });
      }

      if (req.file) {
        //upload the image on cloudinary here
        data.imageUrl = 'coudinary image path';
      }
      let updatedInstance = await Visit.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Visit Updated',
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
      let existing = await Visit.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: true,
          message: 'Visit Not Found',
        });
      }

      

      // console.log("checking condition",  !req.user._id.equals(existing.employeeId) &&
      // existing.role != OPTIONS.usersRoles.SUPER_ADMIN)
     
      console.log("checking condition",  !req.user._id.equals(existing.employeeId) &&
      existing.role != OPTIONS.usersRoles.SUPER_ADMIN)
      if (
        !req.user._id.equals(existing.employeeId) &&
        existing.role != OPTIONS.usersRoles.SUPER_ADMIN
      ) {
        return res.unauthorized('Only creator can delete');
      }

      //DELETE ASSOCIATED IMAGE FROM CLOUDINARY
      existing.imageUrl ? await deleteFile(existing.imageUrl) : null;
      const deleted = await Visit.findByIdAndDelete(req.params.id);
      return res.success({
        success: true,
        message: 'Visit Deleted',
        data: deleted,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
};
module.exports = userObj;
