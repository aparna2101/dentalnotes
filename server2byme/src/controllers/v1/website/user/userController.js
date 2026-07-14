const bcrypt = require('bcrypt');
const mail = require('../../../../models/helpers/EmailHelper');

const User = require('../../../../models/User');
const Subject = require('../../../../models/subject');
const Chapter = require('../../../../models/chapter');
const DemoVideo = require('../../../../models/demoVideo');
const ChapterVideo = require('../../../../models/chapterVideo');
const CourseBundle = require('../../../../models/courseBundle');
const BasicDetail = require('../../../../models/basicDetail');
const EducationAndCarrier = require('../../../../models/educationAndCarrier');
const FamilyDetail = require('../../../../models/familyDetail');
const Access = require('../../../../models/access');
const IgnoreProfile = require('../../../../models/ignore');
const {
  ageCalculator,
  maskContact,
  maskEmail,
  checkAccess,
  updateProfieview,
  daysLeft,
} = require('../../../../../utils/smallHelperFunctions');
const Cart = require('../../../../models/cart');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const mongoose = require('mongoose');
const PartnerPreference = require('../../../../models/partnerPreference');

const {
  uploadFromBuffer,
  uploadPdfFromBuffer,
  deleteFile,
} = require('../../../../../utils/cloudinary');
const OPTIONS = require('../../../../config/Options');
const jwtOptions = require('../../../../config/JwtOptions');
const { check } = require('express-validator');
const ProfileView = require('../../../../models/profileView');
const Shortlist = require('../../../../models/shortlist');
const Report = require('../../../../models/report');
const Interest = require('../../../../models/interest');
const GalleryAccess = require('../../../../models/galleryAccess');
const { message } = require('../chat/userController');
const subscriptionHistory = require('../../../../models/subscriptionHistory');
const ObjectId = mongoose.Types.ObjectId;
const autoDeleteIn = process.env.TTL_ACTION_DCCUMENT || 1;

const userObj = {
  create: async (req, res) => {
    try {
      const { email, password, firstName, lastName, phoneNumber } = req.body;

      const data = {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      };

      const exist = await User.findOne({ email: email });
      const existphoneNumber = await User.findOne({ phoneNumber: phoneNumber });

      console.log('exist', exist);
      if (exist) {
        return res.status(401).json({
          message: 'Email Already Exist',
        });
      }

      if (existphoneNumber) {
        return res.status(409).json({
          message: 'phone Number Already Exist',
        });
      }

      if (req.file) {
        //upload the image on cloudinary here
        console.log('Your hit the create image', req.file.buffer);
        data.imageUrl = await uploadFromBuffer(req.file.buffer);
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(Math.random() * 899999 + 100000);
      data.resetPasswordOTP = otp;
      data.emailVerified = false;

      let user = await User.create(data);

      // Send the Verification OTP Email
      let emailData = {
        userName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        otp: otp
      };
      
      try {
        mail.sendSignupOtpMail(emailData);
      } catch (mailError) {
        console.error('Error sending signup verification mail:', mailError);
      }

      res.success({
        message: 'Registration successful! Verification OTP sent to your email.',
        success: true,
        needsVerification: true,
        userId: user._id,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  verifySignupOtp: async (req, res) => {
    try {
      const { userId, otp } = req.body;

      if (!userId || !otp) {
        return res.status(400).json({
          success: false,
          message: 'User ID and OTP are required',
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check if OTP matches
      if (user.resetPasswordOTP === String(otp)) {
        user.emailVerified = true;
        user.resetPasswordOTP = null; // Clear the OTP
        await user.save();

        return res.status(200).json({
          success: true,
          message: 'Email verified successfully! You can now log in.',
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP code. Please try again.',
        });
      }
    } catch (e) {
      console.error('Error in verifySignupOtp:', e);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  createSubject: async (req, res) => {
    try {
      const { subjectName, description, serialNumber, price = 99 } = req.body;

      const data = {
        subjectName,
        description,
        serialNumber,
        year: req.body.year || "",
        courseType: req.body.courseType || "",
        price: price === "" ? 99 : price,
      };

      const existChapterName = await Subject.findOne({
        subjectName: subjectName,
        year: req.body.year || "",
      });

      console.log('what you found', existChapterName);

      if (existChapterName) {
        return res.status(401).json({
          message: 'Subject Already Exist',
        });
      }

      if (req.file) {
        console.log('Your hit the create image', req.file.buffer);
        data.imageUrl = await uploadFromBuffer(req.file.buffer);
      }
      let chapter = await Subject.create(data);

      res.success({
        message: 'Subject Created',
        success: true,
        data: chapter,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
  updateSubject: async (req, res) => {
    try {
      const { subjectName, description, serialNumber, price } = req.body;

      const data = {
        subjectName,
        description,
        serialNumber,
        year: req.body.year || "",
        courseType: req.body.courseType || "",
        price,
      };

      const existingSubject = await Subject.findById(req.params.id);

      if (!existingSubject) {
        return res.status(401).json({
          message: 'Subject Not Found',
        });
      }

      const existChapterName = await Subject.findOne({
        subjectName: subjectName,
        _id: { $ne: req.params.id }, // ✅ Correct way to check "id not equal to"
      });

      if (existChapterName) {
        return res.status(401).json({
          message: 'Subject Name  Already Exist',
        });
      }

      if (req.file) {
        console.log('Your hit the create image', req.file.buffer);
        data.imageUrl = await uploadFromBuffer(req.file.buffer);
      }
      let subject = await Subject.findOneAndUpdate(
        { _id: req.params.id },
        data
      );

      res.success({
        message: 'subject updated',
        success: true,
        data: subject,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  createChapter: async (req, res) => {
    try {
      const { chapterName, subjectId } = req.body;

      const data = {
        chapterName,
        subjectId,
      };

      const existchapterName = await Chapter.findOne({
        chapterName: chapterName,
        subjectId: new mongoose.Types.ObjectId(subjectId),
      });

      console.log('in which you find out id', existchapterName);

      if (existchapterName) {
        return res.status(401).json({
          message: 'chapterName Already Exist',
        });
      }

      const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0] : null;
      const dictionaryUrl = req.files['dictionaryUrl'] ? req.files['dictionaryUrl'][0] : null;

      if (pdfUrl) {
        console.log('📥 PDF Buffer Size:', pdfUrl.buffer.length); // log size
        data.pdfUrl = await uploadPdfFromBuffer(pdfUrl.buffer);
      }

      if (dictionaryUrl) {
        console.log('Your hit the create image', dictionaryUrl.buffer);
        data.dictionaryUrl = await uploadPdfFromBuffer(dictionaryUrl.buffer);
      }

      let chapter = await Chapter.create(data);

      res.success({
        message: 'chapter Created',
        success: true,
        data: chapter,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('you Error', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  updateChapter: async (req, res) => {
    try {
      const { chapterName, subjectId, serialNumber } = req.body;

      const data = {
        chapterName,
        subjectId,
        serialNumber,
      };

      const existing = await Chapter.findById(req.params.id);

      if (!existing) {
        res.status(404).json({
          success: false,
          message: 'Chapter Not found',
        });
      }

      const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0] : null;
      const dictionaryUrl = req.files['dictionaryUrl'] ? req.files['dictionaryUrl'][0] : null;
      const videoUrl = req.files['videoUrl'] ? req.files['videoUrl'][0] : null;

      if (pdfUrl) {
        console.log('Your hit the create image', pdfUrl.buffer);
        data.pdfUrl = await uploadPdfFromBuffer(pdfUrl.buffer);
      }

      if (dictionaryUrl) {
        console.log('Your hit the create image', dictionaryUrl.buffer);
        data.dictionaryUrl = await uploadPdfFromBuffer(dictionaryUrl.buffer);
      }
      if (videoUrl) {
        console.log('Your hit the create video', videoUrl.buffer);
        data.videoUrl = await uploadPdfFromBuffer(videoUrl.buffer);
      }

      const updatedChapter = await Chapter.findOneAndUpdate(
        { _id: req.params.id },
        data
      );

      return res.success({
        message: 'chapter updated',
        success: true,
        data: updatedChapter,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('you Error', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getAllChapterOfSubject: async (req, res) => {
    try {
      const subjects = await Subject.findOne({ _id: req.params.id }).lean(); // returns a plain JS object
      const chapters = await Chapter.find({ subjectId: req.params.id }).lean();

      const data = {
        ...subjects,
        chapters,
      };
      return res.success({
        success: true,
        data: data,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('you Error', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getChapterById: async (req, res) => {
    try {
      const { user } = req;
      const allSubs = await subscriptionHistory.find({ userId: user._id });
      const isPremium = user.isPremium;

      const activeSubs = allSubs.filter((sub) => {
        const expiry = new Date(sub.createdAt);
        expiry.setDate(expiry.getDate() + (sub.spanLife || 365));
        return expiry >= new Date();
      });

      const purchasedSubjectIds = activeSubs
        .filter(sub => sub.subscriptionType !== "Bundle")
        .map(sub => (sub?.module?._id || sub?.moduleId || sub?.module)?.toString())
        .filter(Boolean);

      const purchasedBundles = activeSubs
        .filter(sub => sub.subscriptionType === "Bundle")
        .map(sub => ({
          year: sub.module?.year,
          courseType: sub.module?.courseType
        }));

      const chapter = await Chapter.findOne({ _id: req.params.id }).lean();

      if (!chapter) {
        return res.status(404).json({
          message: 'chapter not found',
          success: false,
        });
      }

      const subject = await Subject.findOne({ _id: chapter.subjectId }).lean();

      const isBundlePurchased = subject && purchasedBundles.some(
        b => b.year === subject.year && (b.courseType?.toLowerCase() === subject.courseType?.toLowerCase() || b.courseType?.toLowerCase() === "full")
      );

      if (!isPremium && !purchasedSubjectIds.includes(chapter?.subjectId?.toString()) && !isBundlePurchased) {
        return res.status(404).json({
          message: 'Purchase the Course',
          success: false,
        });
      }

      if (!chapter) {
        return res.status(404).json({
          message: 'chapter not found',
          success: false,
        });
      }
      const data = {
        ...subject,
        chapter,
      };

      res.success({
        message: 'Get  Created',
        success: true,
        data: data,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('you Error', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getSubjectById: async (req, res) => {
    try {
      const subject = await Subject.findOne({ _id: req.params.id }).lean();
      if (!subject) {
        return res.status(404).json({
          message: 'Subject not found',
          success: false,
        });
      }

      res.success({
        success: true,
        data: subject,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('you Error', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getAllSubject: async (req, res) => {
    try {
      const { user = {} } = req;

      let isPremium = user?.isPremium || false;
      const allSubs = await subscriptionHistory.find({ userId: user?._id }) || [];

      const activeSubs = allSubs.filter((sub) => {
        const expiry = new Date(sub.createdAt);
        expiry.setDate(expiry.getDate() + (sub.spanLife || 365));
        return expiry >= new Date();
      });

      const purchasedSubjectIds = activeSubs
        .filter(sub => sub.subscriptionType !== "Bundle")
        .map(sub => (sub?.module?._id || sub?.moduleId || sub?.module)?.toString())
        .filter(Boolean);

      const purchasedBundles = activeSubs
        .filter(sub => sub.subscriptionType === "Bundle")
        .map(sub => ({
          year: sub.module?.year,
          courseType: sub.module?.courseType
        }));

      // Now mark purchased subjects
      let subjects = await Subject.find({}).sort({ createdAt: -1 });

      subjects = subjects.map((sub) => {
        const isIndividualPurchased = purchasedSubjectIds.includes(sub._id.toString());
        const isBundlePurchased = purchasedBundles.some(
          b => b.year === sub.year && (b.courseType?.toLowerCase() === sub.courseType?.toLowerCase() || b.courseType?.toLowerCase() === "full")
        );

        return {
          ...sub.toObject(),
          isPurchased: isPremium || isIndividualPurchased || isBundlePurchased,
        };
      });

      res.success({
        message: 'chapter Created',
        success: true,
        data: subjects,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('you Error', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  addDemoVideo: async (req, res) => {
    try {
      const { title, courseType, year, serialNumber, subjectId } = req.body;
      const data = { title, courseType, year, serialNumber, subjectId };

      if (req.file) {
        data.videoUrl = await uploadFromBuffer(req.file.buffer);
      } else if (req.body.videoUrl) {
        data.videoUrl = req.body.videoUrl;
      }

      const video = await DemoVideo.create(data);
      res.success({
        message: 'Demo Video Added',
        success: true,
        data: video,
      });
    } catch (e) {
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
      throw new Error(e);
    }
  },

  getAllDemoVideos: async (req, res) => {
    try {
      const videos = await DemoVideo.find({}).populate('subjectId', 'subjectName').sort({ serialNumber: 1 });
      res.success({
        message: 'Demo Videos Fetched',
        success: true,
        data: videos,
      });
    } catch (e) {
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
      throw new Error(e);
    }
  },

  deleteDemoVideo: async (req, res) => {
    try {
      await DemoVideo.findByIdAndDelete(req.params.id);
      res.success({
        message: 'Demo Video Deleted',
        success: true,
      });
    } catch (e) {
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
      throw new Error(e);
    }
  },

  setBundlePrice: async (req, res) => {
    try {
      const { year, courseType, price, description } = req.body;

      const bundle = await CourseBundle.findOneAndUpdate(
        { year, courseType },
        { price, description },
        { new: true, upsert: true }
      );

      res.success({
        message: 'Bundle Price Updated',
        success: true,
        data: bundle,
      });
    } catch (e) {
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
      throw new Error(e);
    }
  },

  getBundlePrices: async (req, res) => {
    try {
      const bundles = await CourseBundle.find({});
      res.success({
        message: 'Bundle Prices Fetched',
        success: true,
        data: bundles,
      });
    } catch (e) {
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
      throw new Error(e);
    }
  },

  deleteBundlePrice: async (req, res) => {
    try {
      await CourseBundle.findByIdAndDelete(req.params.id);
      res.success({
        message: 'Bundle Price Deleted',
        success: true,
      });
    } catch (e) {
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
      throw new Error(e);
    }
  },

  removeSubject: async (req, res) => {
    try {
      const subject = await Subject.findOne({ _id: req.params.id }).lean();
      if (!subject) {
        res.status(404).json({
          success: false,
          message: 'Subject not found',
        });
      }

      await Subject.deleteOne({ _id: req.params.id });

      res.success({
        message: 'Subject Deleted',
        success: true,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('you Error', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  removeChapter: async (req, res) => {
    try {
      const subject = await Chapter.findOne({ _id: req.params.id }).lean();
      if (!subject) {
        res.status(404).json({
          success: false,
          message: 'Subject not found',
        });
      }

      await Chapter.deleteOne({ _id: req.params.id });

      res.success({
        message: 'Chapter Deleted',
        success: true,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('you Error', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  verifyMe: async (req, res) => {
    try {
      const user = req.user;

      console.log('your in request', user);
      const data = {
        isAuthenticated: true,
        isPremium: user.isPremium,
      };
      res.success({
        message: 'Get  Created',
        success: true,
        data: data,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('you Error', e);
      res.serverError(errors);
      throw new Error(e);
    }
  },

  createBasicDetail: async (req, res) => {
    try {
      const userId = req.user?._id || req.body.userId;
      let {
        DOB,
        maritalStatus,
        religion,
        caste,
        motherTongue,
        height,
        disable,
      } = req.body;

      const existing = await User.findById(userId);
      if (!existing) {
        return res.status(404).json({
          message: 'User Not Found',
          success: false,
        });
      }

      let actualHeight = OPTIONS.heightOptions.getActualHeight(height);
      const data = {
        DOB,
        maritalStatus,
        religion,
        caste,
        motherTongue,
        height,
        actualHeight,
        disable,
        userId,
      };
      let newInstance = await BasicDetail.create(data);
      existing.heigh = newInstance.height;
      existing.maritalStatus = newInstance.maritalStatus;
      existing.religion = newInstance.religion;
      existing.age = ageCalculator(1998, 12);
      existing.step1 = true;
      newInstance.age = existing.age;
      await newInstance.save();
      await existing.save();

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

  createEducationAndCarrier: async (req, res) => {
    try {
      const userId = req.user?._id || req.body.userId;
      let {
        country,
        state,
        city,
        isLivedWithParent,
        higestEducation,
        employedIn,
        occupation,
        annualIncome,
        collegeInstitute,
      } = req.body;
      let actualIncome =
        OPTIONS.annualIncomeOptions.getActualValue(annualIncome);
      const existing = await User.findById(userId);
      if (!existing) {
        return res.status(404).json({
          message: 'User Not Found',
          success: false,
        });
      }

      const data = {
        country,
        state,
        city,
        isLivedWithParent,
        higestEducation,
        employedIn,
        occupation,
        annualIncome,
        collegeInstitute,
        actualIncome,
        userId,
      };
      let newInstance = await EducationAndCarrier.create(data);
      existing.state = state;
      existing.city = city;
      existing.country = country;
      existing.step2 = true;
      existing.higestEducation = newInstance.higestEducation;

      await newInstance.save();
      await existing.save();

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

  createFamilyDetail: async (req, res) => {
    try {
      const userId = req.user?._id || req.body.userId;
      let {
        familyType,
        familyStatus,
        nativeState,
        nativeCity,
        fatherName,
        fatherOccupation,
        motherOccupation,
        numberOfBrother,
        numberOfMarriedBrother,
        numberOfSister,
        numberOfMarriedsister,
        aboutFamily,
      } = req.body;
      const existing = await User.findById(userId);
      if (!existing) {
        return res.status(404).json({
          message: 'User Not Found',
          success: false,
        });
      }

      const data = {
        familyType,
        familyStatus,
        nativeState,
        nativeCity,
        fatherName,
        fatherOccupation,
        motherOccupation,
        numberOfBrother,
        numberOfMarriedBrother,
        numberOfSister,
        numberOfMarriedsister,
        aboutFamily,
        userId,
      };
      let newInstance = await FamilyDetail.create(data);
      await PartnerPreference.create({ userId });

      await newInstance.save();

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

  shortListPofile: async (req, res) => {
    try {
      const userId = req.user?._id;
      const targetUserId = new mongoose.Types.ObjectId(req.params.id);
      const exist = await Shortlist.findOne({
        shortlistedProfile: new mongoose.Types.ObjectId(targetUserId),
        shortlistedBy: userId,
      });

      console.log('your user in req', req.user);

      if (exist) {
        Shortlist.findOneAndUpdate(
          { shortlistedProfile: userId, shortlistedBy: targetUserId },
          {
            expireAt: new Date(Date.now() + autoDeleteIn * 24 * 60 * 60 * 1000),
          }
        );
        return res.success({
          success: true,
          message: 'Profile ShortListed',
        });
      } else {
        await Shortlist.create({
          shortlistedProfile: new mongoose.Types.ObjectId(targetUserId),
          shortlistedBy: userId,
        });
      }

      res.success({
        success: true,
        message: 'shortListed',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },
  profile: async (req, res) => {
    try {
      const userId =
        req.user?._id || new mongoose.Types.ObjectId(req.body.userId);

      const pipeline = [
        {
          $facet: {
            // 1. Fetch new profiles based on createdAt
            newProfiles: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  },
                },
              }, // Last 7 days
              { $sort: { createdAt: -1 } }, // Sort by most recent
              { $limit: 10 }, // Limit to 10 new profiles
              {
                $project: {
                  _id: 1, // Include _id
                  firstName: 1, // Include name
                  lastName: 1, // Include age
                  gender: 1, // Include location
                  religion: 1, // Include location
                  maritalStatus: 1, // Include location
                  city: 1, // Include location
                  higestEducation: 1,
                  height: 1,
                },
              },
            ],

            // 2. Fetch best match profiles (adjust match criteria as needed)
            bestMatch: [
              {
                $match: {
                  age: { $gte: 25, $lte: 35 }, // Example age filter
                  location: 'Mumbai', // Example location filter
                  gender: 'female', // Example gender filter
                },
              },
              { $sort: { matchScore: -1 } }, // Sort by custom match score
              { $limit: 10 }, // Limit to 10 best matches
            ],

            // 3. Fetch recently viewed profiles by the logged-in user
            recentlyViewed: [
              { $match: { userId: userId } }, // Match recently viewed profiles for this user
              {
                $lookup: {
                  from: 'profiles', // Assuming 'profiles' is the collection
                  localField: 'viewedProfileId',
                  foreignField: '_id',
                  as: 'viewedProfile',
                },
              },
              { $unwind: '$viewedProfile' }, // Unwind the array of viewed profiles
              { $limit: 10 }, // Limit to 10 recently viewed profiles
            ],
          },
        },
      ];

      // Run the aggregation
      const result = await User.aggregate(pipeline);

      res.success({
        success: true,
        message: 'shortListed',
        data: result,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  uploadImage: async (req, res) => {
    try {
      const userId = req.user?._id;
      const existing = await User.findById(userId);

      const profileImage = req.files['profileImage']
        ? req.files['profileImage'][0]
        : null;
      const image1 = req.files['image1'] ? req.files['image1'][0] : null;
      const image2 = req.files['image2'] ? req.files['image2'][0] : null;
      const image3 = req.files['image3'] ? req.files['image3'][0] : null;

      console.log('imamge1', existing);
      console.log('imamge2', image2);
      if (profileImage) {
        //upload the image on cloudinary here
        existing.profileImage ? await deleteFile(existing.profileImage) : null;
        const imageurl = await uploadFromBuffer(profileImage.buffer);
        existing.profileImage = imageurl;
      }

      if (image1) {
        //upload the image on cloudinary here
        existing.image1 ? await deleteFile(existing.image1) : null;
        const imageurl = await uploadFromBuffer(image1.buffer);
        existing.image1 = imageurl;
      }

      if (image2) {
        //upload the image on cloudinary here
        existing.image2 ? await deleteFile(existing.image2) : null;
        const imageurl = await uploadFromBuffer(image2.buffer);
        existing.image2 = imageurl;
      }

      if (image3) {
        //upload the image on cloudinary here
        existing.image3 ? await deleteFile(existing.image3) : null;
        const imageurl = await uploadFromBuffer(image3.buffer);
        existing.image3 = imageurl;
      }

      await existing.save();
      // if (req.file) {
      //   //upload the image on cloudinary here
      //   existing.imageUrl ? await deleteFile(existing.imageUrl) : null;
      //   data.imageUrl = await uploadFromBuffer(req.file.buffer);
      // }

      // if (req.file) {
      //   //upload the image on cloudinary here
      //   existing.imageUrl ? await deleteFile(existing.imageUrl) : null;
      //   data.imageUrl = await uploadFromBuffer(req.file.buffer);
      // }

      // if (req.file) {
      //   //upload the image on cloudinary here
      //   existing.imageUrl ? await deleteFile(existing.imageUrl) : null;
      //   data.imageUrl = await uploadFromBuffer(req.file.buffer);
      // }

      res.success({
        success: true,
        message: 'shortListed',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  ignoreProfile: async (req, res) => {
    try {
      const userId = req.user?._id;
      const targetUserId = new mongoose.Types.ObjectId(req.params.id);
      console.log('hit the ignore Route');
      console.time('Find Profile Time');

      // const explain = await IgnoreProfile.findOne({ userId: userId, ingoreProfile: targetUserId }).explain();
      // console.log(explain);

      const exist = await IgnoreProfile.findOne({
        userId: userId,
        ignoreProfile: targetUserId,
      });
      console.timeEnd('Find Profile Time');
      if (exist) {
        console.time('Find Profile Time');
        IgnoreProfile.findOneAndUpdate(
          { userId: userId, ignoreProfile: targetUserId },
          { expireAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
        )
          .then(() => {
            console.log('Document updated asynchronously');
          })
          .catch((e) => {
            console.error('Error updating document: ', e);
          });

        console.timeEnd('Find Profile Time');
      } else {
        await IgnoreProfile.create({
          userId: userId,
          ignoreProfile: targetUserId,
        });
      }

      res.success({
        success: true,
        message: 'Profile add to Ignore List',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  expressInterest: async (req, res) => {
    console.log('express interest hit');
    try {
      const userId =
        req.user?._id || new mongoose.Types.ObjectId(req.body.userId);
      const targetUserId = new mongoose.Types.ObjectId(req.params.id);

      const exist = await Interest.findOne({
        interestInitiator: userId,
        profileOwner: targetUserId,
      });

      if (exist) {
        return res.status(400).json({
          success: true,
          message: 'Already expressed Interest',
        });
      }
      await Interest.create({
        interestInitiator: userId,
        profileOwner: targetUserId,
      });
      res.success({
        success: true,
        message: 'Interest Sent',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  galleryRequest: async (req, res) => {
    try {
      console.log('Your hit the route');
      const userId =
        req.user?._id || new mongoose.Types.ObjectId(req.body.userId);
      const targetId = new mongoose.Types.ObjectId(req.params.id);
      console.log('your body', req.body);
      console.log('your id', userId, targetId);

      const user = await User.findById(userId);
      const targetUser = await User.findById(targetId);

      if (targetUser.galleryAccess) {
      }

      const exist = await GalleryAccess.findOne({
        profileOwner: targetId,
        galleryAccessInitiator: userId,
      });

      if (exist) {
        let day = daysLeft(exist.expireAt);
        return res.status(400).json({
          success: true,
          message: `You can Re-Request after ${day} days`,
        });
      }
      await GalleryAccess.create({
        profileOwner: targetId,
        galleryAccessInitiator: userId,
      });
      res.success({
        success: true,
        message: `Request For Gallery Access`,
      });
    } catch (e) {
      console.log('Error', e);
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  actionOnGalleryRequest: async (req, res) => {
    try {
      const { status } = req.body;
      const userId =
        req.user?._id || new mongoose.Types.ObjectId(req.body.userId);
      const requestId = new mongoose.Types.ObjectId(req.params.id);

      const exist = await GalleryAccess.findById(requestId);

      if (!exist) {
        return res.notFound('Not found');
      }

      if (!exist.profileOwner.equals(userId)) {
        return res.forbidden();
      }

      if (status == 'Accepted') {
        const access = await Access.findOne({
          userId: exist.galleryAccessInitiator,
          targetUserId: exist.profileOwner,
        });

        if (access) {
          access.hasGalleryAccess = true;
          await access.save();
        } else {
          await Access.create({
            userId: exist.galleryAccessInitiator,
            targetUserId: exist.profileOwner,
            hasGalleryAccess: true,
          });
        }
      }

      exist.status = status;
      await exist.save();

      res.success({
        success: true,
        message: `Gallery Access ${status}`,
      });
    } catch (e) {
      console.log('Error', e);
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  reportProfile: async (req, res) => {
    try {
      const userId =
        req.user?._id || new mongoose.Types.ObjectId(req.body.userId);
      const targetUserId = new mongoose.Types.ObjectId(req.params.id);

      const { reason, description } = req.body;

      const exist = await Report.findOne({
        reportedBy: userId,
        reportedProfile: targetUserId,
      });

      if (exist) {
        return res.status(400).json({
          message: 'Already Reported',
        });
      }
      await Report.create({
        reportedBy: userId,
        reportedProfile: targetUserId,
        reason,
        description,
      });
      res.success({
        success: true,
        message: 'User Preported Successfully',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  getContactAccess: async (req, res) => {
    try {
      const userId = req.user?._id || req.body.userId;
      const targetUserId = req.params.id;

      const user = await User.findById(userId);
      let isPrimeUser = true;
      let contactDetailAccess = 5;

      if (!isPrimeUser || !contactDetailAccess > 0) {
        res.status(400).json({
          message: isPrimeUser
            ? 'Buy Premium Access'
            : 'Contact Details access exhausted',
        });
      }

      const existing = await Access.findOne({ targetUserId, userId });

      if (existing && existing.hasContactAccess) {
        return res.success({
          message: 'Already has Access',
        });
      }

      if (existing) {
        await Access.findOneAndUpdate(
          { targetUserId, userId },
          { hasContactAccess: true }
        );
      } else {
        Access.create({ userId, targetUserId, hasContactAccess: true });
      }

      //DECREASE THE FAMILYACCESS COUNT OF USER

      res.success({
        success: true,
        message: 'Access Granted ',
      });
    } catch (error) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('error', error);
      res.serverError(errors);
    }
  },

  getFamilyDetailAccess: async (req, res) => {
    try {
      const userId = req.user?._id || req.body.userId;
      const targetUserId = req.params.id;

      const user = await User.findById(userId);
      let isPrimeUser = true;
      let remainingFamilyAccess = 5;

      if (!isPrimeUser || !remainingFamilyAccess > 0) {
        res.status(400).json({
          message: isPrimeUser
            ? 'Buy Premium Access'
            : 'Family details access exhausted',
        });
      }

      const existing = await Access.findOne({ targetUserId, userId });

      if (existing && existing.hasFamilyAccess) {
        return res.success({
          message: 'Already has Access',
        });
      }

      if (existing) {
        await Access.findOneAndUpdate(
          { targetUserId, userId },
          { hasFamilyAccess: true }
        );
      } else {
        Access.create({ userId, targetUserId, hasFamilyAccess: true });
      }

      //DECREASE THE FAMILYACCESS COUNT OF USER

      res.success({
        success: true,
        message: 'Access Granted ',
      });
    } catch (error) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('error', error);
      res.serverError(errors);
    }
  },

  myProfile: async (req, res) => {
    let {
      page = 1,
      pageSize = 10,
      search = null,
      column = 'createdAt',
      direction = -1,
    } = req.query;
    const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

    const userId = req.user._id || req.body.userId;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId), // Replace `id` with the ID you are looking for
        },
      },
      {
        $lookup: {
          from: 'BasicDetail', // The collection you are joining with
          localField: '_id', // The field from the Order collection
          foreignField: 'userId', // The field from the Customer collection
          as: 'BasicInfo', // The name of the output array field
          pipeline: [
            {
              $project: {
                _id: 0, // Exclude the _id field
                religion: 1, // Include the firstName field
                height: 1,
                age: 1,
                motherTongue: 1,
                religion: 1,
                maritalStatus: 1,
                DOB: 1,
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: '$BasicInfo', // Flatten the manageByInfo array
          preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
        },
      },

      {
        $lookup: {
          from: 'EducationAndCarrier', // The collection you are joining with
          localField: '_id', // The field from the Order collection
          foreignField: 'userId', // The field from the Customer collection
          as: 'EducationAndCarrierInfo', // The name of the output array field
          pipeline: [
            {
              $project: {
                _id: 1, // Exclude the _id field
                higestEducation: 1, // Include the firstName field
                annualIncome: 1,
                isLivedWithParent: 1,
                occupation: 1,
                employedIn: 1,
                collegeInstitute: 1,
                annualIncome: 1,
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: '$EducationAndCarrierInfo', // Flatten the manageByInfo array
          preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
        },
      },

      {
        $lookup: {
          from: 'FamilyDetail', // The collection you are joining with
          localField: '_id', // The field from the Order collection
          foreignField: 'userId', // The field from the Customer collection
          as: 'familyDetailinfo', // The name of the output array field
          pipeline: [
            {
              $project: {
                _id: 0, // Exclude the _id field
                familyType: 1,
                familyStatus: 1,
                nativeState: 1,
                nativeCity: 1,
                fatherName: 1,
                fatherOccupation: 1,
                motherOccupation: 1,
                aboutFamily: 1,
                numberOfMarriedsister: 1,
                numberOfSister: 1,
                numberOfBrother: 1,
                numberOfMarriedBrother: 1,
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: '$familyDetailinfo', // Flatten the manageByInfo array
          preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
        },
      },

      // {
      //   $unwind: '$products', // To flatten the products array
      // },

      {
        $lookup: {
          from: 'PartnerPreference', // The collection you are joining with
          localField: '_id', // The field from the products array
          foreignField: 'userId', // The field from the Product collection
          as: 'partnerPreferenceInfo', // The name of the output array field
          pipeline: [
            {
              $project: {
                annualIncome: 1, // Exclude the _id field
                education: 1, // Include the title field
                state: 1, // Include the imageUrl field
                city: 1,
                country: 1,
                motherTongue: 1,
                occupation: 1,
                maritalStatus: 1,
                heightTo: 1,
                heightFrom: 1,
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: '$partnerPreferenceInfo', // Flatten the manageByInfo array
          preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
        },
      },
      {
        $group: {
          _id: '$_id',
          BasicInfo: { $first: '$BasicInfo' },
          EducationAndCarrierInfo: { $first: '$EducationAndCarrierInfo' },
          partnerPreferenceInfo: { $first: '$partnerPreferenceInfo' },
          familyDetailinfo: { $first: '$familyDetailinfo' },
          // Add any other fields here that you want to include
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
    const resp = await User.aggregate(pipeline);
    const totalCount =
      resp.length > 0 && resp[0].metadata.length > 0
        ? resp[0].metadata[0].total
        : 0;
    const data = resp.length > 0 && resp[0].data ? resp[0].data[0] : [];

    return res.success({
      data,
      totalCount,
    });
  },

  GetProfileById: async (req, res) => {
    let {
      page = 1,
      pageSize = 10,
      search = null,
      column = 'createdAt',
      direction = -1,
    } = req.query;
    const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

    const userId = req.user._id;
    const targetUserId = new mongoose.Types.ObjectId(req.params.id);

    const pipeline = [
      {
        $match: {
          _id: targetUserId, // Replace `id` with the ID you are looking for
        },
      },
      {
        $lookup: {
          from: 'BasicDetail', // The collection you are joining with
          localField: '_id', // The field from the Order collection
          foreignField: 'userId', // The field from the Customer collection
          as: 'BasicInfo', // The name of the output array field
          pipeline: [
            {
              $project: {
                _id: 0, // Exclude the _id field
                religion: 1, // Include the firstName field
                height: 1,
                gender: 1,
                age: 1,
                motherTongue: 1,
                religion: 1,
                maritalStatus: 1,
                DOB: 1,
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: '$BasicInfo', // Flatten the manageByInfo array
          preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
        },
      },

      {
        $lookup: {
          from: 'EducationAndCarrier', // The collection you are joining with
          localField: '_id', // The field from the Order collection
          foreignField: 'userId', // The field from the Customer collection
          as: 'EducationAndCarrierInfo', // The name of the output array field
          pipeline: [
            {
              $project: {
                _id: 1, // Exclude the _id field
                higestEducation: 1, // Include the firstName field
                annualIncome: 1,
                isLivedWithParent: 1,
                occupation: 1,
                employedIn: 1,
                collegeInstitute: 1,
                annualIncome: 1,
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: '$EducationAndCarrierInfo', // Flatten the manageByInfo array
          preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
        },
      },

      {
        $lookup: {
          from: 'FamilyDetail', // The collection you are joining with
          localField: '_id', // The field from the Order collection
          foreignField: 'userId', // The field from the Customer collection
          as: 'familyDetailinfo', // The name of the output array field
          pipeline: [
            {
              $project: {
                _id: 0, // Exclude the _id field
                familyType: 1,
                familyStatus: 1,
                nativeState: 1,
                nativeCity: 1,
                fatherName: 1,
                fatherOccupation: 1,
                motherOccupation: 1,
                aboutFamily: 1,
                numberOfMarriedsister: 1,
                numberOfSister: 1,
                numberOfBrother: 1,
                numberOfMarriedBrother: 1,
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: '$familyDetailinfo', // Flatten the manageByInfo array
          preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
        },
      },

      // {
      //   $unwind: '$products', // To flatten the products array
      // },

      {
        $lookup: {
          from: 'PartnerPreference', // The collection you are joining with
          localField: '_id', // The field from the products array
          foreignField: 'userId', // The field from the Product collection
          as: 'partnerPreferenceInfo', // The name of the output array field
          pipeline: [
            {
              $project: {
                annualIncome: 1, // Exclude the _id field
                education: 1, // Include the title field
                state: 1, // Include the imageUrl field
                city: 1,
                country: 1,
                motherTongue: 1,
                occupation: 1,
                maritalStatus: 1,
                heightTo: 1,
                heightFrom: 1,
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: '$partnerPreferenceInfo', // Flatten the manageByInfo array
          preserveNullAndEmptyArrays: true, // Keep documents even if manageByInfo is null or empty
        },
      },
      {
        $group: {
          _id: '$_id',
          phoneNumber: { $first: '$phoneNumber' },
          profileImage: { $first: '$profileImage' },
          image1: { $first: '$image1' },
          image2: { $first: '$image2' },
          image3: { $first: '$image3' },
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          religion: { $first: '$religion' },
          gender: { $first: '$gender' },
          city: { $first: '$city' },
          maritalStatus: { $first: '$maritalStatus' },
          email: { $first: '$email' },
          BasicInfo: { $first: '$BasicInfo' },
          EducationAndCarrierInfo: { $first: '$EducationAndCarrierInfo' },
          partnerPreferenceInfo: { $first: '$partnerPreferenceInfo' },
          familyDetailinfo: { $first: '$familyDetailinfo' },
          // Add any other fields here that you want to include
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
    const resp = await User.aggregate(pipeline);
    const totalCount =
      resp.length > 0 && resp[0].metadata.length > 0
        ? resp[0].metadata[0].total
        : 0;
    const data = resp.length > 0 && resp[0].data ? resp[0].data[0] : [];

    const { hasContactAccess, hasFamilyAccess } = await checkAccess(
      userId,
      targetUserId
    );

    if (!hasContactAccess) {
      data.phoneNumber = maskContact(data?.phoneNumber);
      data.email = maskEmail(data.email);
    }
    if (!hasFamilyAccess) {
      data.familyDetailinfo.fatherName;
      const keys = Object.keys(data.familyDetailinfo);
      keys.map((key) => {
        data.familyDetailinfo[key] = '********';
      });
    }

    updateProfieview(userId, targetUserId);

    data.BasicInfo.gender = data.gender;
    data.BasicInfo.firstName = data.firstName;
    data.BasicInfo.lastName = data.lastName;

    return res.success({
      data,
      totalCount,
    });
  },

  updateInterest: async (req, res) => {
    try {
      const userId =
        req.user?._id || new mongoose.Types.ObjectId(req.body.userId);
      const interestId = new mongoose.Types.ObjectId(req.params.id);

      const exist = await Interest.findById(interestId);

      if (!exist) {
        return res.status(400).json({
          success: true,
          message: 'Interest Not found',
        });
      }
      await Interest.findOneAndUpdate(
        { _id: interestId },
        { status: req.body.status }
      );
      res.success({
        success: true,
        message: `Interest ${req.body.status}`,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  updateEducationAndCarrier: async (req, res) => {
    try {
      const userId = req.user?._id || req.body.userId;
      let {
        country,
        state,
        city,
        isLivedWithParent,
        higestEducation,
        employedIn,
        occupation,
        annualIncome,
        collegeInstitute,
      } = req.body;
      let actualIncome =
        OPTIONS.annualIncomeOptions.getActualValue(annualIncome);
      const existing = await User.findById(userId);
      if (!existing) {
        return res.status(404).json({
          message: 'User Not Found',
          success: false,
        });
      }

      const data = {
        country,
        state,
        city,
        isLivedWithParent,
        higestEducation,
        employedIn,
        occupation,
        annualIncome,
        collegeInstitute,
        actualIncome,
        userId,
      };
      let newInstance = await EducationAndCarrier.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        data,
        { new: true }
      );

      console.log('find Carrier', newInstance);
      existing.state = state;
      existing.city = city;
      existing.country = country;
      existing.step2 = true;
      existing.higestEducation = newInstance.higestEducation;

      await newInstance.save();
      await existing.save();

      res.success({
        success: true,
        message: 'Education&Carrier updated',
        data: newInstance,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  updateFamilyDetail: async (req, res) => {
    try {
      const userId = req.user?._id || req.body.userId;
      let {
        familyType,
        familyStatus,
        nativeState,
        nativeCity,
        fatherName,
        fatherOccupation,
        motherOccupation,
        numberOfBrother,
        numberOfMarriedBrother,
        numberOfSister,
        numberOfMarriedsister,
        aboutFamily,
      } = req.body;

      console.log('checking Datat in body', req.body);
      const existing = await User.findById(userId);
      if (!existing) {
        return res.status(404).json({
          message: 'User Not Found',
          success: false,
        });
      }

      const data = {
        familyType,
        familyStatus,
        nativeState,
        nativeCity,
        fatherName,
        fatherOccupation,
        motherOccupation,
        numberOfBrother,
        numberOfMarriedBrother,
        numberOfSister,
        numberOfMarriedsister,
        aboutFamily,
      };
      let newInstance = await FamilyDetail.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        data,
        { new: true }
      );

      res.success({
        success: true,
        message: 'family Detail Updated',
        data: newInstance,
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.serverError(errors);
      throw new Error(e);
    }
  },

  updatePartnerPreference: async (req, res) => {
    try {
      console.log('hit the game**********');
      const userId = req.user?._id || req.body.userId;
      console.log('your body', req.body);
      let {
        state,
        city,
        motherTongue,
        occupation,
        education,
        heightFrom,
        heightTo,
        ageTo,
        ageFrom,
        annualIncome,
        maritalStatus,
        country,
      } = req.body;

      const existing = await PartnerPreference.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      });
      console.log('your preference', existing);
      if (!existing) {
        return res.status(404).json({
          message: 'Partner Preference Not Found',
          success: false,
        });
      }

      let actualIncome =
        OPTIONS.annualIncomeOptions.getActualValue(annualIncome);
      let actualHeightFrom = OPTIONS.heightOptions.getActualHeight(heightFrom);
      let actualHeightTo = OPTIONS.heightOptions.getActualHeight(heightTo);

      const data = {
        actualIncome,
        state,
        city,
        motherTongue,
        occupation,
        education,
        actualHeightTo,
        heightTo,
        actualHeightFrom,
        ageTo,
        ageFrom,
        heightFrom,
        annualIncome,
        maritalStatus,
        country,
      };

      let newInstance = await PartnerPreference.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        data,
        { new: true }
      );

      res.success({
        success: true,
        message: 'Partner Preference Updated',
        data: newInstance,
      });
    } catch (error) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      console.log('error', error);

      res.serverError(error);
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

      const pipeline = [
        {
          $match: {
            $and: [
              {
                $or: [
                  { firstName: { $regex: search || '', $options: 'i' } }, // Case-insensitive search by name
                  { email: { $regex: search || '', $options: 'i' } }, // Case-insensitive search by email
                  { lastName: { $regex: search || '', $options: 'i' } }, // Case-insensitive search by last name
                ],
              },
              { isDelete: { $ne: true } }, // Exclude documents where isDelete is true
            ],
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

  ProfileViewByMe: async (req, res) => {
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

      const userId = req.user._id;

      console.log('your user inn req', req.user);

      const pipeline = [
        {
          $match: {
            profileViewBy: userId, // Matching the specific user
          },
        },
        {
          $lookup: {
            from: 'User', // Collection to join with (assuming it's named 'users')
            localField: 'profileOwner', // Field from the current collection
            foreignField: '_id', // Field from the 'users' collection
            as: 'userDetails', // Name of the output array field
          },
        },
        {
          $unwind: '$userDetails', // Deconstructs the array to get a single object
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$$ROOT', '$userDetails'], // Merge fields from both documents
            },
          },
        },
        {
          $sort: { isOnline: -1, [column]: direction }, // Sorting based on user status and dynamic column
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }], // Count total matched documents
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await ProfileView.aggregate(pipeline);
      console.log('response', resp);

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

  whoViewMyProfile: async (req, res) => {
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

      const userId = req.user._id;

      console.log('your user inn req', req.user);

      const pipeline = [
        {
          $match: {
            profileOwner: userId, // Matching the specific user
          },
        },
        {
          $lookup: {
            from: 'User', // Collection to join with (assuming it's named 'users')
            localField: 'profileViewBy', // Field from the current collection
            foreignField: '_id', // Field from the 'users' collection
            as: 'userDetails', // Name of the output array field
          },
        },
        {
          $unwind: '$userDetails', // Deconstructs the array to get a single object
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$$ROOT', '$userDetails'], // Merge fields from both documents
            },
          },
        },
        {
          $sort: { isOnline: -1, [column]: direction }, // Sorting based on user status and dynamic column
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }], // Count total matched documents
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await ProfileView.aggregate(pipeline);
      console.log('response', resp);

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

  ignoreProfileByMe: async (req, res) => {
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

      const userId = req.user._id;

      console.log('your user inn req', req.user);

      const pipeline = [
        {
          $match: {
            userId: userId, // Matching the specific user
          },
        },
        {
          $lookup: {
            from: 'User', // Collection to join with (assuming it's named 'users')
            localField: 'ignoreProfile', // Field from the current collection
            foreignField: '_id', // Field from the 'users' collection
            as: 'userDetails', // Name of the output array field
          },
        },
        {
          $unwind: '$userDetails', // Deconstructs the array to get a single object
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$$ROOT', '$userDetails'], // Merge fields from both documents
            },
          },
        },
        {
          $sort: { isOnline: -1, [column]: direction }, // Sorting based on user status and dynamic column
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }], // Count total matched documents
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await IgnoreProfile.aggregate(pipeline);
      console.log('response', resp);

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

  profileShortlistedByMe: async (req, res) => {
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

      const userId = req.user._id;

      console.log('shortlisted', req.user);

      const pipeline = [
        {
          $match: {
            shortlistedBy: userId, // Matching the specific user
          },
        },
        {
          $lookup: {
            from: 'User', // Collection to join with (assuming it's named 'users')
            localField: 'shortlistedProfile', // Field from the current collection
            foreignField: '_id', // Field from the 'users' collection
            as: 'userDetails', // Name of the output array field
          },
        },
        {
          $unwind: '$userDetails', // Deconstructs the array to get a single object
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$$ROOT', '$userDetails'], // Merge fields from both documents
            },
          },
        },
        {
          $sort: { isOnline: -1, [column]: direction }, // Sorting based on user status and dynamic column
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }], // Count total matched documents
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await Shortlist.aggregate(pipeline);
      console.log('response', resp);

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
  myInterest: async (req, res) => {
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

      const userId = req.user._id;

      console.log('Interest', req.user);

      const pipeline = [
        {
          $match: {
            interestInitiator: userId, // Matching the specific user
          },
        },
        {
          $lookup: {
            from: 'User', // Collection to join with (assuming it's named 'users')
            localField: 'profileOwner', // Field from the current collection
            foreignField: '_id', // Field from the 'users' collection
            as: 'userDetails', // Name of the output array field
          },
        },
        {
          $unwind: '$userDetails', // Deconstructs the array to get a single object
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$$ROOT', '$userDetails'], // Merge fields from both documents
            },
          },
        },
        {
          $sort: { isOnline: -1, [column]: direction }, // Sorting based on user status and dynamic column
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }], // Count total matched documents
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await Interest.aggregate(pipeline);
      console.log('response', resp);

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
  whoIsInterestedInMe: async (req, res) => {
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

      const userId = req.user._id;

      console.log('Interest', req.user);

      const pipeline = [
        {
          $match: {
            profileOwner: userId, // Matching the specific user
          },
        },
        {
          $lookup: {
            from: 'User', // Collection to join with (assuming it's named 'users')
            localField: 'interestInitiator', // Field from the current collection
            foreignField: '_id', // Field from the 'users' collection
            as: 'userDetails', // Name of the output array field
          },
        },
        {
          $unwind: '$userDetails', // Deconstructs the array to get a single object
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$$ROOT', '$userDetails'], // Merge fields from both documents
            },
          },
        },
        {
          $sort: { isOnline: -1, [column]: direction }, // Sorting based on user status and dynamic column
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }], // Count total matched documents
            data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
          },
        },
      ];
      const resp = await Interest.aggregate(pipeline);
      console.log('response', resp);

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

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'Please sign up first',
        });
      }

      if (!(await existingUser.isPasswordMatch(req.body.password))) {
        return res.status(404).json({
          success: false,
          message: 'Incorrect password',
        });
      }

      let token = existingUser.genToken();
      existingUser.lastLoginAt = Date.now();
      existingUser.recentToken = token;
      await existingUser.save();
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
      const {
        firstName,
        lastName,
        role,
        gender,
        phoneNumber,
        whatsAppNumber,
        status,
        state,
        city,
        region,
      } = req.body;
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
      return res.status(200).json({
        success: true,
        message: 'User Verified',
      });
    } catch (e) {
      const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
      res.status(500).json({ success: false, message: errors });
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
          message: 'User with this email does not exist',
        });
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(Math.random() * 899999 + 100000);
      existing.resetPasswordOTP = otp;
      let user = await existing.save();

      // Construct the reset URL for the frontend
      // The frontend reset-password page is hosted on the main website domain.
      const resetUrl = `https://dentalnotesrep.com/reset-password?email=${user.email}&otp=${otp}`;

      let data = {
        userName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        resetUrl: resetUrl
      };

      mail.sendForgetMail(data);

      return res.status(200).json({ success: true, message: 'Reset link sent to your email' });
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
      const { email, newPassword, resetPasswordOTP } = req.body;

      if (!email || !newPassword || !resetPasswordOTP) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required (email, newPassword, resetPasswordOTP)',
        });
      }

      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Invalid Email',
        });
      }

      if (user.resetPasswordOTP === resetPasswordOTP) {
        user.password = newPassword; // Pre-save hook in User.js will hash it
        user.resetPasswordOTP = null;
        await user.save();

        return res.status(200).json({
          success: true,
          message: 'Password updated successfully. You can now login.',
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP/Link',
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

  createChapterVideo: async (req, res) => {
    try {
      const { chapterId, title } = req.body;
      const file = req.file || (req.files && req.files['videoUrl'] ? req.files['videoUrl'][0] : null);

      if (!file) {
        return res.status(400).json({ message: 'Video file is required' });
      }
      if (!chapterId) {
        return res.status(400).json({ message: 'Chapter ID is required' });
      }
      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Video Heading/Title is required' });
      }

      console.log('📥 Uploading chapter video locally for chapter:', chapterId);
      const fs = require('fs');
      const path = require('path');
      const videosDir = path.resolve('./videos');
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }

      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const localFilePath = path.join(videosDir, uniqueFilename);
      fs.writeFileSync(localFilePath, file.buffer);

      const protocol = req.protocol;
      const host = req.get('host');
      const videoUrl = `${protocol}://${host}/videos/${uniqueFilename}`;

      // Count existing videos to assign default serialNumber
      const count = await ChapterVideo.countDocuments({ chapterId });

      const newVideo = await ChapterVideo.create({
        chapterId,
        videoUrl,
        serialNumber: count + 1,
        title: title || `Video ${count + 1}`,
      });

      res.success({
        message: 'Chapter video uploaded successfully',
        success: true,
        data: newVideo,
      });
    } catch (e) {
      console.error(e);
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
    }
  },

  getAllVideosOfChapter: async (req, res) => {
    try {
      const { chapterId } = req.params;
      if (!chapterId) {
        return res.status(400).json({ message: 'Chapter ID is required' });
      }

      const videos = await ChapterVideo.find({ chapterId }).sort({ serialNumber: 1 });
      res.success({
        message: 'Chapter videos fetched successfully',
        success: true,
        data: videos,
      });
    } catch (e) {
      console.error(e);
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
    }
  },

  getAllChapterVideos: async (req, res) => {
    try {
      const videos = await ChapterVideo.find({})
        .populate({
          path: 'chapterId',
          populate: {
            path: 'subjectId',
          }
        })
        .sort({ createdAt: -1 });

      res.success({
        message: 'All chapter videos fetched successfully',
        success: true,
        data: videos,
      });
    } catch (e) {
      console.error(e);
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
    }
  },

  deleteChapterVideo: async (req, res) => {
    try {
      const { id } = req.params;
      const video = await ChapterVideo.findById(id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      // Delete from local disk or Cloudinary
      if (video.videoUrl) {
        if (video.videoUrl.includes('/videos/')) {
          try {
            const fs = require('fs');
            const path = require('path');
            const oldFilename = video.videoUrl.split('/videos/')[1];
            const oldFilePath = path.join(path.resolve('./videos'), oldFilename);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          } catch (err) {
            console.error('Local file delete error:', err);
          }
        } else {
          try {
            await deleteFile(video.videoUrl);
          } catch (err) {
            console.error('Cloudinary delete error:', err);
          }
        }
      }

      await ChapterVideo.findByIdAndDelete(id);

      res.success({
        message: 'Video deleted successfully',
        success: true,
      });
    } catch (e) {
      console.error(e);
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
    }
  },

  updateChapterVideo: async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const file = req.file || (req.files && req.files['videoUrl'] ? req.files['videoUrl'][0] : null);

      const video = await ChapterVideo.findById(id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      let updatedData = {};
      if (title) {
        updatedData.title = title;
      }

      if (file) {
        console.log('📥 Replacing video file for chapter video locally:', id);
        const fs = require('fs');
        const path = require('path');
        const videosDir = path.resolve('./videos');
        if (!fs.existsSync(videosDir)) {
          fs.mkdirSync(videosDir, { recursive: true });
        }

        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const localFilePath = path.join(videosDir, uniqueFilename);
        fs.writeFileSync(localFilePath, file.buffer);

        // Delete old video file from local disk or Cloudinary
        if (video.videoUrl) {
          if (video.videoUrl.includes('/videos/')) {
            try {
              const oldFilename = video.videoUrl.split('/videos/')[1];
              const oldFilePath = path.join(videosDir, oldFilename);
              if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
              }
            } catch (err) {
              console.error('Local file delete error:', err);
            }
          } else {
            try {
              await deleteFile(video.videoUrl);
            } catch (err) {
              console.error('Cloudinary old file delete error:', err);
            }
          }
        }

        const protocol = req.protocol;
        const host = req.get('host');
        updatedData.videoUrl = `${protocol}://${host}/videos/${uniqueFilename}`;
      }

      const updatedVideo = await ChapterVideo.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );

      res.success({
        message: 'Video updated successfully',
        success: true,
        data: updatedVideo,
      });
    } catch (e) {
      console.error(e);
      res.serverError(MESSAGES.apiErrorStrings.SERVER_ERROR);
    }
  },
};

module.exports = userObj;
