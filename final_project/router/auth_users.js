/**
 * @deprecated Moved to src/routes/auth_users
 */
const regd_users = require("../src/routes/auth_users.js");
const DB = require("../data/index.js");
const AuthController = require("../src/controllers/auth_users.js");

const { isValid } = new AuthController(DB);

module.exports.auth = regd_users;
module.exports.users = DB.USERS;
module.exports.isValid = isValid;
