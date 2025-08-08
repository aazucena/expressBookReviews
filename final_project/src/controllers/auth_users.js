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

  
  /**
   * Validate ISBN-10 or ISBN-13 string.
   *
   * @param {string} input - The ISBN string to validate.
   * @returns {boolean} True if the ISBN is valid, false otherwise.
   */
  validateISBN = (input) => {
    const isbn = input.replace(/[^0-9X]/gi, '');
    const length = isbn.length;

    if (length !== 10 && length !== 13) {
      return false; // Not a valid ISBN length
    }

    if (length === 10) {
      // Validate ISBN-10
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        const digit = parseInt(isbn[i], 10);
        if (isNaN(digit)) return false;
        sum += digit * (10 - i);
      }

      const checkDigit = isbn[9].toUpperCase() === 'X' ? 10 : parseInt(isbn[9], 10);
      return (sum % 11 === 0) && !isNaN(checkDigit);
    }

    if (length === 13) {
      // Validate ISBN-13
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(isbn[i], 10);
        if (isNaN(digit)) return false;
        sum += (i % 2 === 0) ? digit : (digit * 3);
      }

      const checkDigit = parseInt(isbn[12], 10);
      return (10 - (sum % 10)) % 10 === checkDigit;
    }

    return false; // Should not reach here
  }
};
