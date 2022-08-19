const { StatusCodes } = require("http-status-codes");

class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

class UnauthorisedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthorisedError,
};
