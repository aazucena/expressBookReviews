const jwt = require("jsonwebtoken");
const { STATUS } = require("../variables/index.js");
const { sendResponseText } = require("../utils/index.js");

/**
 * Middleware to verify if the user is authenticated by checking the JWT token in the session.
 *
 * If the session contains an authorization object with a valid JWT access token,
 * it verifies the token and attaches the decoded user information to the request object.
 * If the token is invalid or missing, it sends an unauthorized response.
 *
 * @param {import("express").Request} req - The request object, containing session and user information.
 * @param {import("express").Response} res - The response object, used to send back the response.
 * @param {import("express").NextFunction} next - The next middleware function to be called if authentication succeeds.
 */

const userVerificationMiddleware = async(req, res, next) => {
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];
    // Verify JWT token
    jwt.verify(token, "access", async(err, user) => {
      if (!err) {
        req.user = user;
        next(); // Proceed to the next middleware
      } else {
        return await sendResponseText(
          res,
          STATUS.UNAUTHORIZED,
          "User not authenticated",
        );
      }
    });
  } else {
    return await sendResponseText(res, STATUS.UNAUTHORIZED, "User not logged in");
  }
};

module.exports = {
  userVerificationMiddleware,
};
