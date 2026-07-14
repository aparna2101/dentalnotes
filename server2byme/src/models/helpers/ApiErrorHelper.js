class ApiError {
    constructor(code, applicationErrorCode) {
      this.code = code;
      this.applicationErrorCode = applicationErrorCode;
    }
  
    static badRequest(applicationErrorCode) {
      return new ApiError(400, applicationErrorCode);
    }
    static unAuthorized(applicationErrorCode) {
      return new ApiError(401, applicationErrorCode);
    }
    static internal(applicationErrorCode) {
      return new ApiError(500, applicationErrorCode);
    }
  }
  
  module.exports = ApiError;