module.exports = class AuthController {
  /**
   * Constructs a new AuthController instance.
   *
   * @param {Database} db - An instance of the Database class, providing access to the application's database.
   */
  constructor(db) {
    this.DB = db;
  }

  /**
   * Checks if the given username is valid.
   *
   * A valid username is one that is not already associated with any existing user.
   *
   * @param {string} username - The username to check
   * @returns {boolean} True if the username is valid, false if not
   */
  isValid = (username) => {
    const existingUser = this.DB.USERS.filter(
      (user) => user.username === username,
    );
    return !!existingUser;
  };

  /**
   * Authenticates a user by verifying if the provided username and password match
   * an existing user in the USERS collection.
   *
   * @param {string} username - The username to authenticate
   * @param {string} password - The password to authenticate
   * @returns {boolean} True if the username and password match an existing user,
   * otherwise false
   */
  authenticateUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    const existingUser = this.DB.USERS.find((user) => {
      return user.username === username && user.password === password;
    });
    // If a matching user is found, return true
    if (existingUser) {
      return true;
    }
    // Otherwise, return false
    return false;
  };

  /**
   * Masks a password by replacing each character with an asterisk.
   *
   * @param {string} password - The password to be masked.
   * @returns {string} The masked password with asterisks.
   */

  blockPassword = (password) => {
    return new Array(password.length).fill("*").join("");
  };
};
