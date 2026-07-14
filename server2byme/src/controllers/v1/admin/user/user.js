const bcrypt = require('bcrypt');
const User = require('../../../../models/User');
const Cart = require('../.../../../../../models/cart');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const mongoose = require('mongoose');

const {
  uploadFromBuffer,
  deleteFile,
} = require('../../../../../utils/cloudinary');
const OPTIONS = require('../../../../config/Options');
const jwtOptions = require('../../../../config/JwtOptions');
const ObjectId = mongoose.Types.ObjectId;

const userObj = {
  create: async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        gender,
        phoneNumber,
        whatsAppNumber,
        role,
        state,
        region,
        city,
      } = req.body;
      const data = {
        email,
        password,
        firstName,
        lastName,
        gender,
        phoneNumber,
        whatsAppNumber,
        role,
        state,
        city,
      };

      region && role === OPTIONS.usersRoles.ZONAL_SALES_MANAGER
        ? (data.region = region)
        : null;

      console.log('your data wile submiting', data);

      const exist = await User.findOne({ email: email });
      const existphoneNumber = await User.findOne({ phoneNumber: phoneNumber });
      const existwhatsAppNumber = await User.findOne({
        whatsAppNumber: whatsAppNumber,
      });
      console.log('exist', exist);
      if (exist) {
        res.status(401).json({
          message: 'Email Already Exist',
        });
      }

      if (existphoneNumber) {
        res.status(409).json({
          message: 'phone Number Already Exist',
        });
      }

      if (existphoneNumber) {
        res.status(409).json({
          message: 'whatsApp Number Already Exist',
        });
      }

      if (req.file) {
        //upload the image on cloudinary here
        console.log('Your hit the create image', req.file.buffer);
        data.imageUrl = await uploadFromBuffer(req.file.buffer);
      }
      let user = await User.create(data);
      await Cart.create({ customerId: user._id });

      res.success({
        message: 'User Created',
        success: true,
        data: user,
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
        pageSize = 9999999,
        search = null,
        column = 'createdAt',
        direction = -1,
        role = [],
      } = req.query;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

      console.log('your Qyer', {
        ...(role.length > 0 && {
          role: { $in: role },
        }),
      });
      const isAdmin = req.user.role == OPTIONS.usersRoles.ADMIN;
      const userId = req.user._id;
      const pipeline = [
        {
          $match: {
            $and: [
              {
                ...(isAdmin
                  ? {}
                  : {
                      $or: [
                        { _id: userId }, // Allow non-admins to view their own info
                        { role: 'RETAILER' }, // Allow non-admins to view users with role 'retailer'
                      ],
                    }),
              },
              {
                $or: [
                  { firstName: { $regex: search || '', $options: 'i' } }, // Case-insensitive search by name
                  { email: { $regex: search || '', $options: 'i' } }, // Case-insensitive search by email
                  { lastName: { $regex: search || '', $options: 'i' } }, // Case-insensitive search by last name
                ],
              },
              {
                ...(role.length > 0 ? { role: { $in: role } } : {}), // Correct conditional structure for role
              },
              { isDelete: { $ne: true } }, // Exclude documents where isDelete is true
            ],
          },
        },
        {
          $addFields: {
            name: {
              $concat: [
                { $ifNull: ['$firstName', ''] },
                ' ',
                { $ifNull: ['$lastName', ''] },
              ],
            },
          },
        },
        { $sort: { isOnline: -1, [column]: direction } },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];

      const resp = await User.aggregate(pipeline);
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
      console.log(err);
      res.serverError(errors);
    }
  },

  login: async (req, res) => {
    try {
      console.log('USEr is trying to login');
      let existingUser = await User.findOne({ email: req.body.email }).select(
        '+password'
      );

      console.log('user find for login', existingUser);

      if (
        !existingUser ||
        !(await existingUser.isPasswordMatch(req.body.password))
      ) {
        return res.status(404).json({
          success: false,
          message: 'Invalid User or Password',
        });
      }

      existingUser.lastLoginAt = Date.now();
      await existingUser.save();
      let token = existingUser.genToken();
      return res.status(200).json({
        success: true,
        message: 'User login Successfully',
        data: { token, user: existingUser },
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const userId = req.user._id;
      const existing = await User.findById(userId);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: existing,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getById: async (req, res) => {
    try {
      const userId = req.params.id;
      const existing = await User.findById(userId);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
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
      const userId = req.user._id || req.body.userId;
      const {
        firstName,
        lastName,
        phoneNumber,
        status,
        gender,
        city,
        state,
        region,
      } = req.body;
      const data = {
        firstName,
        lastName,
        phoneNumber,
        status,
        gender,
        city,
        state,
        region,
      };
      console.log('updating the user', data);
      const updated = await User.findOneAndUpdate({ _id: userId }, data, {
        new: true,
      });

      return res.success({
        success: true,
        message: 'User pdated',
        data: updated,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      console.error(e);
    }
  },

  updateById: async (req, res) => {
    try {
      // const userId = req.user._id || req.body.userId;
      const { firstName, lastName, role, gender, phoneNumber, whatsAppNumber,status,state,city,region } =
        req.body;
      const data = {
        firstName,
        lastName,
        role,
        gender,
        phoneNumber,
        whatsAppNumber,   
        status,
        city,
        state,
        region,
      };
      console.log('your req.file', req.file);
      const existing = await User.findById(req.params.id);

      if (
        !req.user._id.equals(existing._id) &&
        req.user.role != OPTIONS.usersRoles.ADMIN
      ) {
        return res.unauthorized('Only for super_Admin & own User');
      }

      if (req.file) {
        //upload the image on cloudinary here
        console.log('Your hit the create image', req.file.buffer);
        data.imageUrl = await uploadFromBuffer(req.file.buffer);
      }

      const updated = await User.findOneAndUpdate(
        { _id: req.params.id },
        data,
        {
          new: true,
        }
      );

      return res.success({
        success: true,
        message: 'User updated',
        data: updated,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      console.error(e);
    }
  },

  // changeStatus: async (req, res) => {

  //   try {
  //     let existing = await User.findOne({ _id: req.params.id });
  //     if (!existing) {
  //       return res.status(404).json({success:false,message:"User not found"})
  //     }
  //     existingUser.status =
  //       existingUser.status === OPTIONS.defaultStatus.ACTIVE
  //         ? OPTIONS.defaultStatus.INACTIVE
  //         : OPTIONS.defaultStatus.ACTIVE;
  //     await existingUser.save();
  //     return res.success({
  //       message: MESSAGES.apiSuccessStrings.STATUS_CHANGE('User'),
  //     });
  //   } catch (e) {
  //     const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
  //     res.serverError(errors);
  //     throw new Error(e);
  //   }
  // },

  // delete: async (req, res) => {
  //   try {
  //     let existingUser = await UserRepository.findUserByCondition(
  //       {
  //         _id: new mongoose.Types.ObjectId(req.params.id),
  //         status: { $ne: OPTIONS.defaultStatus.DELETED },
  //       },
  //       {
  //         _id: 1,
  //         id: '$_id',
  //         firstName: 1,
  //         lastName: 1,
  //         email: 1,
  //         phone: 1,
  //         gender: 1,
  //         status: 1,
  //         isDelete: 1,
  //       }
  //     );
  //     if (existingUser) {
  //       const { message } = await UserRepository.patchStatus(
  //         existingUser,
  //         OPTIONS.defaultStatus.DELETED
  //       );
  //       res.success({ message });
  //     } else {
  //       let errors = MESSAGES.apiSuccessStrings.DATA_NOT_EXISTS('User');
  //       return res.unprocessableEntity(errors);
  //     }
  //   } catch (e) {
  //     const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
  //     res.serverError(errors);
  //     throw new Error(e);
  //   }
  // },

  emailVerify: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          success: false,
          message: 'Invalid link or User not found',
        });
      }

      const existing = await User.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Invalid link or User not found',
        });
      }

      existing.emailVerified = true;
      await existing.save();

      //here we will send some sort of ui of html that email is verified
      return res.status(404).json({
        success: true,
        message: 'User Verified',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  forgetPassword: async (req, res) => {
    try {
      let query = {
        email: req.body.email,
      };
      let existing = await User.findOne(query);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Invalied Request',
        });
      }

      existing.resetPasswordOTP = Math.floor(Math.random() * 899999 + 100000);
      let user = await existing.save();
      // let data = {
      //   name: `${user.firstName} ${user.lastName}`,
      //   email: user.email,
      //   url: `${process.env.REQ_URL}#/auth/change-pwd?sub=${user._id}&pin=${user.RESET_PIN}`,
      // };
      // let message = MESSAGES.apiSuccessStrings.EMAIL_FORGOT;
      // mail.sendForgetMail(req, data);

      return res.success({ success: true, message: 'OTP SENT TO EMAIL' });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  //** reset the password */
  updatePassword: async (req, res) => {
    try {
      let query = {
        _id: req.params.id,
      };
      let user = await User.findOne(query);
      if (!user) {
        let error = MESSAGES.apiErrorStrings.USER_DOES_NOT_EXIST;
        return res.preconditionFailed(error);
      } else {
        let isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (isMatch) {
          user.password = await bcrypt.hash(
            req.body.newPassword,
            bcrypt.genSaltSync(8)
          );
          user.LAST_UPDATED_DATE = Date.now();
          let users = await user.save();
          const message = MESSAGES.apiSuccessStrings.PASSWORD('reset');
          return res.success({ message: message });
        } else {
          let errors = MESSAGES.apiErrorStrings.INVALID_CREDENTIALS;
          return res.preconditionFailed(errors);
        }
      }
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);

      throw new Error(e);
    }
  },

  //** reset the password */
  resetPassword: async (req, res) => {
    try {
      const { email, newPassword, comparePassword, resetPasswordOTP } =
        req.body;

      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          success: true,
          message: 'Invalid Email',
        });
      }

      if (user.resetPasswordOTP == resetPasswordOTP) {
        user.password = await bcrypt.hash(newPassword, bcrypt.genSaltSync(8));

        user.resetPasswordOTP = null;
        await user.save();

        return res.status(201).json({
          success: true,
          message: 'PASSWORD UPDATED',
        });
      }
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);

      throw new Error(e);
    }
  },

  //ONLY ADMIN ALLOW TO REACH THIS ROUTES
  deleteUser: async (req, res) => {
    try {
      let query = {
        _id: req.params.id,
      };
      let user = await User.findOne(query);
      console.log('DELETING THE USER', user);
      if (user.isDelete) {
        return res.status(404).json({
          success: true,
          message: 'Invalid User',
        });
      }
      user.isDelete = true;
      await user.save();
      return res.success({
        success: true,
        message: 'User Deleted',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  changeStatus: async (req, res) => {
    try {
      const { status } = req.body;

      let query = {
        _id: req.params.id,
      };

      let user = await User.findOne(query);
      if (!user) {
        return res.status(404).json({
          success: true,
          message: 'Invalid User',
        });
      }
      user.status = status;
      await user.save();

      return res.status(404).json({
        success: true,
        message: 'status Change successfully',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
};

module.exports = userObj;
