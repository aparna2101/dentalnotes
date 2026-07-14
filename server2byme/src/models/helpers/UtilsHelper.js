// const AWSHelpers = require('./AWSHelpers');
// const moment = require('moment');

// exports.randomNumber = function (length) {
//   var text = '';
//   var possible = '123456789';
//   for (var i = 0; i < length; i++) {
//     var sup = Math.floor(Math.random() * possible.length);
//     text += i > 0 && sup == i ? '0' : possible.charAt(sup);
//   }
//   return Number(text);
// };
// const CHAR_LOWER = 'abcdefghijklmnopqrstuvwxyz';
// const CHAR_UPPER = CHAR_LOWER.toUpperCase();
// const NUMBER = '0123456789';
// const SPECIALS = '@';
// const ALPHA_DATA = [CHAR_LOWER, CHAR_UPPER];
// const RANDOM_DATA = [NUMBER, SPECIALS];

// exports.generatePassword = function () {
//   let password = '';
//   for (let i = 0; i < 6; i++) {
//     let rndAlphaAtArr = randomInt(1);
//     let rndAlphaAt = randomInt(ALPHA_DATA[rndAlphaAtArr].toString().length);
//     let rndAlpha = ALPHA_DATA[rndAlphaAtArr].charAt(rndAlphaAt);
//     password += rndAlpha;
//   }
//   password += '@';
//   for (let i = 0; i < 6; i++) {
//     let rndDataAt = randomInt(RANDOM_DATA[0].length);
//     let rndData = RANDOM_DATA[0].charAt(rndDataAt);
//     password += rndData;
//   }
//   return password;
// };

// function randomInt(max) {
//   return Math.floor(Math.random() * (max + 1));
// }

// exports.generateOtp = (length) => {
//   if (process.env.NODE_ENV === 'development') {
//     return length > 4 ? 4444 : 4444;
//   }
//   return Math.floor(1000 + Math.random() * 9000);
// };
// exports.generateCloudFrontUrl = (filePath) => {
//   if (filePath) {
//     return `${process.env.IMAGE_PATH}/${filePath}`;
//   }
//   return '';
// };

// exports.checkImage = (oldImage, newImage) => {
//   if (oldImage) {
//     console.log('oldImage', oldImage);
//     if (
//       newImage &&
//       `post/${oldImage.split('post/')[1]}` !=
//         `post/${newImage.split('post/')[1]}`
//     ) {
//       AWSHelpers.removeFile(oldImage).then();
//       return `post/${newImage.split('post/')[1]}`;
//     }
//     return `post/${oldImage.split('post/')[1]}`;
//   } else if (newImage) {
//     return `post/${newImage.split('post/')[1]}`;
//   } else {
//     return null;
//   }
// };

// const setDate = (date) => {
//   if (date && date.hasOwnProperty('year')) {
//     return moment(`${date.year}-${date.month}-${date.day}`).format(
//       'YYYY-MM-DD'
//     );
//   }
//   return date;
// };
// exports.setDate = setDate;
