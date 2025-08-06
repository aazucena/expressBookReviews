const jwt = require("jsonwebtoken");
const { USERS } = require("../data/index.js");
const { sendResponse, sendResponseText } = require("../utils/index.js");
const { STATUS } = require("../variables/index.js");
const { authenticateUser, isValid } = require("../services/auth.js");

const loginHandler = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return sendResponseText(
      res,
      STATUS.BAD_REQUEST,
      "Missing username or password",
    );
  }
  // Authenticate user
  if (authenticateUser(username, password)) {
    const user = USERS.find((user) => user.username === username);
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 },
    );
    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
      id: user.id,
    };
    return sendResponseText(res, STATUS.OK, "User logged in successfully");
  } else {
    return sendResponseText(
      res,
      STATUS.UNAUTHORIZED,
      "Invalid Login. Check username and password",
    );
  }
};

const registerHandler = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username)) {
    return sendResponseText(
      req,
      res,
      STATUS.BAD_REQUEST,
      "Username already exists",
    );
  }
  if (!username || !password) {
    return sendResponseText(
      req,
      res,
      STATUS.BAD_REQUEST,
      "Missing username or password",
    );
  }

  USERS.push({
    id: crypto.randomUUID(),
    username,
    password,
  });
  return sendResponseText(res, STATUS.CREATED, "User registered successfully");
};

const readMeHandler = (req, res) => {
  const username = req.session.authorization.username;
  const user = USERS.find((user) => user.username === username);
  if (!user) {
    return sendResponseText(res, STATUS.UNAUTHORIZED, "User not logged in");
  }
  user.password = new Array(user.password.length).fill("*").join("");
  return sendResponse(res, STATUS.OK, { data: user });
};

module.exports = {
  loginHandler,
  readMeHandler,
  registerHandler,
};
