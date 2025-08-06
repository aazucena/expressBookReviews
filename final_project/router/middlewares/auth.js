const jwt = require("jsonwebtoken");
const { STATUS } = require("../variables.js");
const { sendResponseText } = require("../utils.js");



const userVerificationMiddleware = (req, res, next) => {
  if (req.session.authorization) {
    let token = req.session.authorization['accessToken'];
    // Verify JWT token
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next(); // Proceed to the next middleware
      } else {
        return sendResponseText(res, STATUS.UNAUTHORIZED, "User not authenticated");
      }
    });
  } else {
    return sendResponseText(res, STATUS.UNAUTHORIZED, "User not logged in");
  }
};

module.exports = {
  userVerificationMiddleware
};
