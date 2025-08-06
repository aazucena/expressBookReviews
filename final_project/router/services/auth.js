const { USERS } = require("../data/index.js");

const isValid = (username) => {
  const existingUser = USERS.find((user) => user.username === username);
  if (existingUser) {
    return false;
  }
  return true;
};

const authenticateUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  const validusers = USERS.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  return validusers.length > 0;
};

module.exports = {
  isValid,
  authenticateUser,
};
