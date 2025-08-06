const jwt = require('jsonwebtoken');
const { USERS } = require("../data/index.js");
const { sendResponseText } = require("../utils.js");
const { STATUS } = require("../variables.js");
const { authenticateUser } = require("../services/auth.js");

const loginHandler = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing username or password");
  }
  // Authenticate user
  if (authenticateUser(username, password)) {
    const user = USERS.find((user) => user.username === username);
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username, id: user.id,
    }
    return sendResponseText(res, STATUS.OK, "User logged in successfully");
  } else {
    return sendResponseText(res, STATUS.UNAUTHORIZED, "Invalid Login. Check username and password");
  }
};


module.exports = {
  loginHandler
}