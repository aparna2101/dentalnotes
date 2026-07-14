const app = require('express').Router();
const multer = require('multer');

const UserController = require('./userController');
const SettingController = require("../setting/settings")
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');

const upload = require('../../../../../utils/upload');

app.get('/getAll', UserController.getAll);

// app.get(
//   '/profileViewByMe',
//   AuthHelper.authenticateJWT([]),
//   UserController.ProfileViewByMe
// );


// app.get(
//   '/whoViewMyProfile',
//   AuthHelper.authenticateJWT([]),
//   UserController.whoViewMyProfile
// );
// app.get(
//   '/profileShortlistedByMe',
//   AuthHelper.authenticateJWT([]),
//   UserController.profileShortlistedByMe
// );
// app.get(
//   '/myInterest',
//   AuthHelper.authenticateJWT([]),
//   UserController.myInterest
// );

// app.get(
//   '/whoIsInterestedInMe',
//   AuthHelper.authenticateJWT([]),
//   UserController.whoIsInterestedInMe
// );
// app.get(
//   '/GetProfileById/:id',
//   AuthHelper.authenticateJWT([]),
//   UserController.GetProfileById
// );
// app.get(
//   '/ignoreProfileByMe',
//   AuthHelper.authenticateJWT([]),
//   UserController.ignoreProfileByMe
// );

// app.post(
//   '/createBasicDetail',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   upload.single('image'),
//   UserController.createBasicDetail
// );

// app.post(
//   '/createEducationAndCarrier',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   UserController.createEducationAndCarrier
// );

// app.post(
//   '/createFamilyDetail',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   UserController.createFamilyDetail
// );

// app.post(
//   '/uploadImage',
//   upload.fields([
//     { name: 'profileImage', maxCount: 1 },
//     { name: 'image1', maxCount: 1 },
//     { name: 'image2', maxCount: 1 },
//     { name: 'image3', maxCount: 1 },
//   ]),
//   AuthHelper.authenticateJWT([]),
//   UserController.uploadImage
// );

// app.post(
//   '/shortListPofile/:id',
//   AuthHelper.authenticateJWT([]),
//   UserController.shortListPofile
// );
// app.post(
//   '/ignoreProfile/:id',
//   AuthHelper.authenticateJWT([]),
//   UserController.ignoreProfile
// );

// app.post(
//   '/reportProfile/:id',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   UserController.reportProfile
// );

// app.post(
//   '/expressInterest/:id',
//   AuthHelper.authenticateJWT([]),
//   UserController.expressInterest
// );

// app.put(
//   '/updateInterest/:id',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   UserController.updateInterest
// );

// app.post(
//   '/galleryRequest/:id',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   UserController.galleryRequest
// );

// app.post(
//   '/actionOnGalleryRequest/:id',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   UserController.actionOnGalleryRequest
// );

// app.put(
//   '/getFamilyDetailAccess/:id',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   UserController.getFamilyDetailAccess
// );
// app.put(
//   '/getContactAccess/:id',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   UserController.getContactAccess
// );

// app.put(
//   '/updateEducationAndCarrier',
//   AuthHelper.authenticateJWT([]),
//   UserController.updateEducationAndCarrier
// );
// app.put(
//   '/updateFamilyDetail',
//   AuthHelper.authenticateJWT([]),
//   UserController.updateFamilyDetail
// );

// app.put(
//   '/updatePartnerPreference',
//   AuthHelper.authenticateJWT([]),
//   UserController.updatePartnerPreference
// );

app.post('/login', UserController.login);
app.post(
  '/register',
  upload.single('image'),
  UserController.create
);
app.post('/verifySignupOtp', UserController.verifySignupOtp);



app.post(
  '/createSubject',
  upload.single('image'),
  UserController.createSubject
);

app.post(
  '/settingOrg',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  SettingController.createSettings
);
app.get(
  '/getSetting',
  //  upload.single('image'),
  SettingController.getSettings
);


app.put(
  '/updateSubject/:id',
  upload.single('image'),
  UserController.updateSubject
);


// app.post(
//   '/createChapter',
//   upload.fields([
//     { name: 'pdfUrl', maxCount: 1 },
//     { name: 'dictionaryUrl', maxCount: 1 },

//   ]),
//   UserController.createChapter
// );

app.post(
  '/createChapter',
  upload.fields([
    { name: 'pdfUrl', maxCount: 1 },
    { name: 'dictionaryUrl', maxCount: 1 },
  ]),
  UserController.createChapter
);
app.post(
  '/createChapterVideo',
  upload.fields([
    { name: 'videoUrl', maxCount: 1 }
  ]),
  UserController.createChapterVideo
);

app.get(
  '/getAllVideosOfChapter/:chapterId',
  UserController.getAllVideosOfChapter
);

app.get(
  '/getAllChapterVideos',
  UserController.getAllChapterVideos
);

app.delete(
  '/deleteChapterVideo/:id',
  UserController.deleteChapterVideo
);

app.put(
  '/updateChapterVideo/:id',
  upload.fields([
    { name: 'videoUrl', maxCount: 1 }
  ]),
  UserController.updateChapterVideo
);


app.put(
  '/updateChapter/:id',
  upload.fields([
    { name: 'pdfUrl', maxCount: 1 },
    { name: 'dictionaryUrl', maxCount: 1 },
    { name: 'videoUrl', maxCount: 1 },
  ]),
  UserController.updateChapter
);


app.get(
  '/getSubjectById/:id',

  UserController.getSubjectById
);



app.get(
  '/getAllSubject',
  // AuthHelper.authenticateJWT([]),
  AuthHelper.authenticateJWT([], false),
  UserController.getAllSubject
);
app.get(
  '/getAllChapterOfSubject/:id',

  UserController.getAllChapterOfSubject
);


app.get(
  '/getChapterById/:id',
  AuthHelper.authenticateJWT([]),
  UserController.getChapterById
);


app.delete(
  '/removeSubject/:id',

  UserController.removeSubject
);

app.delete(
  '/removeChapter/:id',

  UserController.removeChapter
);

// Demo Video Routes
app.post(
  '/addDemoVideo',
  upload.single('video'), // video is the field name
  UserController.addDemoVideo
);

app.get(
  '/getAllDemoVideos',
  UserController.getAllDemoVideos
);

app.delete(
  '/deleteDemoVideo/:id',
  UserController.deleteDemoVideo
);

// Bundle Routes
app.post(
  '/setBundlePrice',
  UserController.setBundlePrice
);

app.get(
  '/getBundlePrices',
  UserController.getBundlePrices
);

app.delete(
  '/deleteBundlePrice/:id',
  UserController.deleteBundlePrice
);


app.get(
  '/verify',
  AuthHelper.authenticateJWT({ isPremium: false }),
  UserController.verifyMe
);







app.get('/myProfile', AuthHelper.authenticateJWT([]), UserController.myProfile);
app.get(
  '/profile',
  //  AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  UserController.profile
);

app.get(
  '/getById/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  UserController.getById
);

app.put(
  '/update',
  AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  UserController.update
);

app.put(
  '/updateById/:id',
  upload.single('image'),
  AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  UserController.updateById
);
// app.delete('/deleteById/:id', validate('checkParamId'), UserController.delete);
app.put('/resetPassword', UserController.resetPassword);
app.put('/updatePassword', UserController.resetPassword);
app.put('/forgetPassword', UserController.forgetPassword);

//admin wil handl this
app.delete('/delete/:id', UserController.deleteUser);
app.put('/changeStatus/:id', UserController.changeStatus);

module.exports = app;
