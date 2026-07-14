exports.getUserAttributes = (extra) => {
  return {
    _id: 1,
    id: '_id',
    firstName: 1,
    lastName: 1,
    email: 1,
    phone: 1,
    gender:1,
    countryCode: 1,
    userName: 1,
    companyName: 1,
    role: 1,
    address: 1,
    status: 1,
    createdAt: 1,
    registrationPlatform: 1,
    profilePicture: 1,
    ...extra,
  };
};
exports.modifyOutputData = (existingUser) => {
  return {
    _id: existingUser._id,
    id: existingUser.id,
    role: existingUser.role,   
    email: existingUser.email,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    userName:existingUser.userName,
    address:existingUser.address,
    // profilePicture: existingUser.profilePicture,
    phone: existingUser.phone,
    // countryCode: existingUser.countryCode,
    phoneVerified: existingUser.phoneVerified,
    emailVerified: existingUser.emailVerified,
    token: existingUser.genToken(),
    // address: existingUser.address,
    status: existingUser.status,
    createdAt: existingUser.createdAt,
    lastSignInAt: existingUser.lastSignInAt,
    // shopDetails: existingUser.shopDetails,
  };
};
