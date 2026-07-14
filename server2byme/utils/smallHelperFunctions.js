const mongoose = require('mongoose');
const Access = require('./../src/models/access');
const ProfileView = require('../src/models/profileView');
const autoDeleteIn = process.env.TTL_ACTION_DCCUMENT || 1;

module.exports.ageCalculator = function calculateAge(
  yearOfBirth,
  monthOfBirth
) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed, so add 1

  // Calculate the initial age difference in years
  let age = currentYear - yearOfBirth;

  // Adjust the age if the birth month has not yet occurred this year
  if (currentMonth < monthOfBirth) {
    age--;
  }

  return age;
};

module.exports.maskContact = function phone(phoneNumber) {
  if (!phoneNumber) {
    return null;
  }

  phoneNumber = phoneNumber.toString();

  return phoneNumber.substring(0, 2) + '******' + phoneNumber.slice(-2);
};

module.exports.maskEmail = function EmailMask(email) {
  if (!email) {
    return null;
  }

  const [userName, domain] = email.split('@');

  return userName.substring(0, 2) + '******' + '@' + domain;
};

module.exports.checkAccess = async function (userId, targetUserId) {
  try {
    // Ensure userId and targetUserId are valid ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(targetUserId)
    ) {
      throw new Error('Invalid user ID or target user ID');
    }

    // Find the access document
    const accessInfo = await Access.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      targetUserId: new mongoose.Types.ObjectId(targetUserId),
    });

    console.log('Your Access Document', accessInfo);

    // Return the access details with default values if no document is found
    return {
      hasContactAccess: accessInfo ? accessInfo.hasContactAccess : false,
      hasFamilyAccess: accessInfo ? accessInfo.hasFamilyAccess : false,
    };
  } catch (error) {
    console.error('Error checking access:', error.message);
    // Handle the error appropriately (e.g., return default values or throw an error)
    return {
      hasContactAccess: false,
      hasFamilyAccess: false,
    };
  }
};

module.exports.updateProfieview = async function (userId, targetUserId) {
  const profileViewExist = await ProfileView.findOne({
    profileOwner: targetUserId,
    profileViewBy: userId,
  });

  if (profileViewExist) {
    console.log('your Profile View Exist', profileViewExist);
    await ProfileView.findOneAndUpdate(
      { profileOwner: targetUserId, profileViewBy: userId },
      { expireAt: new Date(Date.now() + autoDeleteIn * 24 * 60 * 60 * 1000) }
    );
  } else {
    const profileView = await ProfileView.create({
      profileViewBy: userId,
      profileOwner: targetUserId,
    });
  }
};


module.exports.daysLeft= (expireAt) => {
  const currentDate = new Date();
  const expireDate = new Date(expireAt);  // Convert expireAt to Date if it is not already
  const timeDiff = expireDate - currentDate;  // Time difference in milliseconds
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));  // Convert ms to days
  return daysLeft;
};
