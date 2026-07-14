const { body, param, validationResult } = require('express-validator');

exports.schemaValidation = {
  create: [
  body("FIRST_NAME", "FIRST_NAME must not be empty.").exists(),
  body("LAST_NAME", "LAST_NAME must not be empty.").exists(),
  body("EMAIL", "EMAIL must not be empty.").exists().isEmail(),
  body("ROLE", "ROLE must not be empty.").exists(),
  body("PASSWORD", "PASSWORD must not be empty.")
  .exists()
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,25}$/, "i")
  .withMessage(
      "At least 1 upper  const, lower  const, numeric, and special character must be EMBEDDED. Passwords must be at least 8 characters in length but can not be more than 25 characters in length."
  ),
  ],
  checkParamId: [param('id', 'Please enter valid Id').exists()],
  updateProfile: [],
  login: [
    body('email', 'Please enter email').exists(),
    body('password', 'Please enter password').exists(),
  ],
  loginShop: [
    body('mobileNumber', 'Please enter mobileNumber').exists(),
  ],
  register: [
    body('mobileNumber', 'Please enter mobileNumber').exists(),
    body('password', 'Please enter password').exists(),
  ],
  loginCustomer: [
    body('mobileNumber', 'Please enter mobileNumber').exists(),
    body('password', 'Please enter password').exists(),
  ],
  createCustomer: [
    body('firstName', 'Please enter firstName').exists(),
    body('lastName', 'Please enter lastName').exists(),
    body('mobileNumber', 'Please enter mobileNumber').exists(),
  ],
  updateCustomer: [
    body('firstName', 'Please enter firstName').exists(),
    body('lastName', 'Please enter lastName').exists(),
    body('mobileNumber', 'Please enter mobileNumber').exists(),
  ],
  createShop: [
    body('firstName', 'Please enter firstName').exists(),
    body('lastName', 'Please enter lastName').exists(),
    body('mobileNumber', 'Please enter mobileNumber').exists(),
  ],
  createAdvertise: [
    body('title', 'Please enter title').exists(),
    body('startDate', 'Please enter startDate').exists(),
    body('endDate', 'Please enter endDate').exists(),
  ],
  updateAdvertise: [
    body('title', 'Please enter title').exists(),
    body('startDate', 'Please enter startDate').exists(),
    body('endDate', 'Please enter endDate').exists(),
  ],
  createBusinessType: [
    body('name', 'Please enter name').exists(),
  ],
  updateBusinessType: [
    param('id', 'Please enter valid Id').exists(),
    body('name', 'Please enter name').exists(),
  ],
  createCategory: [
    body('name', 'Please enter name').exists(),
  ],
  updateCategory: [
    body('name', 'Please enter name').exists(),
  ],
  createSubCategory: [
    body('categoryId', 'Please enter categoryId').exists(),
    body('name', 'Please enter name').exists(),
  ],
  updateSubCategory: [
    body('categoryId', 'Please enter categoryId').exists(),
    body('name', 'Please enter name').exists(),
  ],
  createOffer: [
    body('title', 'Please enter title').exists(),
    body('startDate', 'Please enter startDate').exists(),
    body('endDate', 'Please enter endDate').exists(),
  ],
  updateOffer: [
    body('title', 'Please enter title').exists(),
    body('startDate', 'Please enter startDate').exists(),
    body('endDate', 'Please enter endDate').exists(),
  ],
  createCatalogue: [
    body('subCategoryId', 'Please enter subCategoryId').exists(),
    body('title', 'Please enter title').exists(),
    body('price', 'Please enter price').exists(),
  ],
  updateCatalogue: [
    body('subCategoryId', 'Please enter subCategoryId').exists(),
    body('title', 'Please enter title').exists(),
    body('price', 'Please enter price').exists(),
  ],
  createSeasonalOffer: [
    body('heading', 'Please enter heading').exists(),
    // body('title', 'Please enter title').exists(),
    body('endDate', 'Please enter endDate').exists(),
    body('startDate', 'Please enter startDate').exists(),
    // body('mediaImage', 'Please enter mediaImage').exists(),
  ],
  updateSeasonalOffer: [
    body('heading', 'Please enter heading').exists(),
    // body('title', 'Please enter title').exists(),
    body('endDate', 'Please enter endDate').exists(),
    body('startDate', 'Please enter startDate').exists(),
    // body('mediaImage', 'Please enter mediaImage').exists(),
  ],
};
