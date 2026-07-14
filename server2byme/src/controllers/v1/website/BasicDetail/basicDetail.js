const User =require("../../../../models/User");
const BasicDetail =require("../../../../models/basicDetail");
const {AgeCalculator}=require("../../../../../utils/smallHelperFunctions")
const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const Invoice = require('../../../../models/invoice');
const mongoose = require('mongoose');


const {
  uploadFromBuffer,
  deleteFile,
} = require("../../../../../utils/cloudinary");
const InVoice = require('../../../../models/invoice');
const OPTIONS = require('../../../../config/Options');


const userObj = {
  create: async (req, res) => {
    try {
      
      const userId=req.user._id  || req.body.userId;
      let {  DOB, maritalStatus,religion, caste,motherTongue,height,disable } = req.body; 

      const existing=await User.findById(userId);
      if (!existing) {
        return res.status(404).json({
          message: 'User Not Found',
          success: false,
        });
      }

      
    let  actualHeight=OPTIONS.heightOptions.getActualHeight(height)
      const data = {
         DOB, maritalStatus,religion, caste,motherTongue,height,actualHeight,disable,userId
      };  
      let newInstance = await BasicDetail.create(data);
      existing.heigh=newInstance.height;
      existing.maritalStatus=newInstance.maritalStatus;
      existing.religion=newInstance.religion;
      existing.age=AgeCalculator(1998,12)
      newInstance.age=existing.age;
      await newInstance.save();
      await existing.save()
      
  
      res.success({
        success: true,
        message: 'BasicDetail created',
        data: newInstance,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

//   getAll: async (req, res) => {
//     try {
//       let {
//         page = 1,
//         pageSize = 10,
//         search = null,
//         column = 'createdAt',
//         direction = -1,
//         typeOfPayment=[]
//       } = req.query;
//       const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
      
//       const isAdmin=req.user.role==OPTIONS.usersRoles.ADMIN || req.user.role==OPTIONS.usersRoles.SUB_ADMIN
//       const userId=req.user._id

//       console.log("your Qyer",{  ...(typeOfPayment.length > 0 && {
//         typeOfPayment: { $in: typeOfPayment }
//       })})

//       const pipeline = [

//         {
//           $match: { 
            
//             ...(isAdmin ? {} : { employeeId: userId }),
//               ...(typeOfPayment.length > 0 && {
//                 typeOfPayment: { $in: typeOfPayment }
//                 })
    
//           },
//       },
//         {
//           $lookup: {
//             from: 'User',
//             localField: 'customerId',
//             foreignField: '_id',
//             as: 'customerInfo',
//             pipeline: [
//               {
//                 $project: {
//                   _id: 0,
//                   firstName: 1,
//                   lastName: 1,
//                   imageUrl: 1,
//                 },
//               },
//             ],
//           },
//         },
//         {
//           $unwind: '$customerInfo',
//         },


//         {
//           $match: {
//             $or: [
//               {
//                 'customerInfo.firstName': {
//                   $regex: search || '',
//                   $options: 'i',
//                 },
//               }, // Search in customer firstName
//               {
//                 'customerInfo.lastName': {
//                   $regex: search || '',
//                   $options: 'i',
//                 },
//               }, // Search in customer lastName
//               { 'customerInfo.email': { $regex: search || '', $options: 'i' } }, // Search in customer email
//             ],
//           },
//         },



//         {
//           $lookup: {
//             from: 'User',
//             localField: 'employeeId',
//             foreignField: '_id',
//             as: 'employeeInfo',
//             pipeline: [
//               {
//                 $project: {
//                   _id: 0,
//                   firstName: 1,
//                   lastName: 1,
//                   imageUrl: 1,
//                 },
//               },
//             ],
//           },
//         },
//         {
//           $unwind: '$employeeInfo',
//         },

//         // First, we add an $addFields stage to check if `isPaymentRecivedByAdmin` is true
//         {
//           $addFields: {
//             isAdminLookupNeeded: { $eq: ['$isPaymentRecivedByAdmin', true] },
//           },
//         },

//         // Then, we perform a conditional $lookup based on the previous result
//         {
//           $lookup: {
//             from: 'User',
//             localField: 'recievedByAdminId', // Direct field matching
//             foreignField: '_id',
//             as: 'adminInfo',
//             pipeline: [
//               {
//                 $project: {
//                   _id: 0,
//                   firstName: 1,
//                   lastName: 1,
//                   imageUrl: 1,
//                 },
//               },
//             ],
//           },
//         },
//         // {
//         //   $unwind: {
//         //     path: '$AdminInfo',
//         //     preserveNullAndEmptyArrays: true, // Preserve if no AdminInfo found
//         //   },
//         // },
//         {
//           $unwind: {
//             path: '$adminInfo',
//             preserveNullAndEmptyArrays: true, // This ensures AdminInfo is null if no match is found or if isPaymentRecivedByAdmin is false
//           },
//         },

//         { $sort: { [column]: direction } },
//         {
//           $facet: {
//             metadata: [{ $count: 'total' }],
//             data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
//           },
//         },
//       ];
//       const resp = await Payment.aggregate(pipeline);
//     console.log("response",resp)
//       //   console.log('Your RES', resp);
//       const totalCount =
//         resp.length > 0 && resp[0].metadata.length > 0
//           ? resp[0].metadata[0].total
//           : 0;
//       const data = resp.length > 0 && resp[0].data ? resp[0].data : [];

//       return res.success({
//         data,
//         totalCount,
//       });
//     } catch (error) {
//       const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
//       console.log('ERROR', error);
//       res.serverError(errors);
//       // throw new Error(errors);
//     }
//   },

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
      console.log('Request come to controller');
      const existing = await Payment.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          message: 'Payment Not Found',
          success: false,
        });
      }

      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id), // Replace `id` with the ID you are looking for
          },
        },
        {
          $lookup: {
            from: 'User',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customerInfo',
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
          $unwind: '$customerInfo',
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

        // First, we add an $addFields stage to check if `isPaymentRecivedByAdmin` is true
        {
          $addFields: {
            isAdminLookupNeeded: { $eq: ['$isPaymentRecivedByAdmin', true] },
          },
        },

        // Then, we perform a conditional $lookup based on the previous result
        {
          $lookup: {
            from: 'User',
            let: {
              adminId: '$recievedByAdminId',
              isAdminLookupNeeded: '$isAdminLookupNeeded',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$isAdminLookupNeeded', true] }, // Check if admin lookup is needed
                      { $eq: ['$_id', '$$adminId'] }, // Match the admin ID
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  firstName: 1,
                  lastName: 1,
                  imageUrl: 1,
                },
              },
            ],
            as: 'AdminInfo',
          },
        },
        {
          $unwind: {
            path: '$AdminInfo',
            preserveNullAndEmptyArrays: true, // This ensures AdminInfo is null if no match is found or if isPaymentRecivedByAdmin is false
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
      const resp = await Payment.aggregate(pipeline);
      //   console.log('Your RES', resp);
      const totalCount =
        resp.length > 0 && resp[0].metadata.length > 0
          ? resp[0].metadata[0].total
          : 0;
      const data = resp.length > 0 && resp[0].data ? resp[0].data : [];

      if (data.length < 1) {
        res.status(404).json({
          message: 'Payment Not Found',
          success: false,
        });
      }

      return res.success({
        data: data[0],
        totalCount,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  update: async (req, res) => {
    try {
    
      const userId=req.user._id
      

      const { typeOfPayment, amountRecived } = req.body;
      const data = { typeOfPayment, amountRecived };
      console.log("***your amount***",amountRecived);

      const existing = await Payment.findById(req.params.id);
      
      if(!userId.equals(existing.employeeId)){
        return res.status(400).json({
          message: 'You must be the creator to modify this item',
          success: false,
        });
      }


      if (!existing) {
        return res.status(404).json({
          message: 'Payment Not Found ',
          success: false,
        });
      }

      if (existing.isPaymentRecivedByAdmin) {
        return res.status(409).json({
          message: 'Payment Already Received By Admin',
          success: false,
        });
      }

      if (req.file) {
     existing.imageUrl? await deleteFile(existing.imageUrl):null;
        data.imageUrl = await uploadFromBuffer(req.file.buffer);
      }
     
      if(existing.amountRecived!==Number(amountRecived)){
        console.log("existing amount re",amountRecived);
        let amount=amountRecived-existing.amountRecived
        console.log("***amount**",amount)
        let existingInvoice=await Invoice.findById(existing.inVoiceId);

        let amountLeft=existingInvoice.amountLeft-(amount);
        let updating=await InVoice.findOneAndUpdate(existing.inVoiceId,{amountLeft:amountLeft});
      }

      let newInstance = await Payment.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );

      res.success({
        success: true,
        message: 'Payment Updated',
        data: newInstance,
      });


    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

//   remove: async (req, res) => {
//     try {
//       let existing = await Payment.findById(req.params.id);


//       if (!existing) {
//         return res.status(404).json({
//           success: false,
//           message: 'Payment Not Found',
//         });
//       }

//       let userId=req.user._id
      
//       if(!userId.equals(existing.employeeId)){
//         return res.status(400).json({
//           message: 'You must be the creator of this Item',
//           success: false,
//         });
//       }

      
//       if (!existing.isPaymentRecivedByAdmin) {
//         return res.unauthorized("Amount Deposited");
//       }

//       //DELETE THE UPLOADED IMAGE TO PARTICULAR PAYMENT
//       console.log("exisint Payment",existing)
//       existing.imageUrl? await deleteFile(existing.imageUrl):null;
//       let existingInvoice=await InVoice.findById(existing.inVoiceId);
//       console.log("exisint Invoice",existingInvoice)
//       existingInvoice.amountLeft=existingInvoice.amountLeft+existing.amountRecived;
//       console.log("updated  Invoice",existingInvoice)
//       //  await existingInvoice.save()
//       console.log("your id to delete",req.params.id)
//       const deletedItem=await Payment.findOneAndDelete(req.params.id);
//       console.log("item is deleting",deletedItem)
//       return res.success({
//         success: true,
//         message: 'Payment Deleted',
//         data:deletedItem
//       });
//     } catch (e) {
//       const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
//       res.serverError(errors);
//       throw new Error(e);
//     }
//   },


//   acceptedByAdmin:async (req, res) => {
//     try {
//       let existing = await Payment.findById(req.params.id);
//       let userId=req.user._id;
//       if (!existing) {
//         return res.status(404).json({
//           success: false,
//           message: 'Payment Not Found',
//         });
//       }

//       if (existing.isPaymentRecivedByAdmin) {
//         return res.status(400).json({message:" Already Amount Deposited"});
//       }

//     existing.isPaymentRecivedByAdmin=true;
//     existing.recievedByAdminId=userId;
//     existing.save();

//       return res.success({
//         success: true,
//         message: 'Payment Recived By Admin'
//       });
//     } catch (e) {
//       const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
//       res.serverError(errors);
//       throw new Error(e);
//     }
//   },
};
module.exports = userObj;
