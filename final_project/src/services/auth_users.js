const jwt = require("jsonwebtoken");
const DB = require("../data/index.js");
const { sendResponse, sendResponseText } = require("../utils/index.js");
const { STATUS } = require("../variables/index.js");
const Controller = require("../controllers/auth_users.js");

const { authenticateUser, blockPassword, isValid, validateISBN } = new Controller(DB);

/**
 * Handles a login request.
 *
 * If the username and password are missing, it sends a bad request response.
 * If the authentication fails, it sends an unauthorized response.
 * If the authentication succeeds, it generates a JWT access token and stores it in the session along with the username and user ID.
 * It then sends an OK response with a message indicating that the user was logged in successfully.
 *
 * @param {import("express").Request} req - The request object, containing the username and password.
 * @param {import("express").Response} res - The response object, used to send back the response.
 */
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
    const user = DB.USERS.find((user) => user.username === username);
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

/**
 * Handles a registration request.
 *
 * If the username already exists, it sends a bad request response indicating that the username already exists.
 * If the username or password is missing, it sends a bad request response indicating that the username or password is missing.
 * If the registration succeeds, it adds the new user to the USERS collection and sends a created response with a message indicating that the user was registered successfully.
 *
 * @param {import("express").Request} req - The request object, containing the username and password.
 * @param {import("express").Response} res - The response object, used to send back the response.
 */
const registerHandler = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username)) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Username already exists");
  }
  if (!username || !password) {
    return sendResponseText(
      res,
      STATUS.BAD_REQUEST,
      "Missing username or password",
    );
  }

  DB.USERS.push({
    id: crypto.randomUUID(),
    username,
    password,
  });
  return sendResponseText(res, STATUS.CREATED, "User registered successfully");
};

/**
 * Retrieves the logged in user's information.
 *
 * If the user is not logged in, it sends an unauthorized response indicating that the user is not logged in.
 * If the user is logged in, it sends an OK response with the user's information, with password replaced with asterisks.
 *
 * @param {import("express").Request} req - The request object, containing the session information.
 * @param {import("express").Response} res - The response object, used to send back the response.
 */
const readMeHandler = (req, res) => {
  const session = req.session;
  const auth = session.authorization;
  if (!auth) {
    return sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }
  const username = auth.username;
  const user = DB.USERS.find((user) => user.username === username);
  if (!user) {
    return sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "Unable to find user. User not logged in",
    });
  }
  user.password = new Array(user.password.length).fill("*").join("");
  return sendResponse(req, res, STATUS.OK, {
    data: user,
    message: "Successfully retrieved user",
  });
};

/**
 * Retrieves a list of all registered users with masked passwords.
 *
 * Sends an OK response containing an array of user objects, each including
 * the username, user ID, and a masked password (replaced with asterisks).
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */

const getUsersHandler = (req, res) => {
  return sendResponse(req, res, STATUS.OK, {
    data: DB.USERS.map((user) => ({
      username: user.username,
      id: user.id,
      password: user.password,
      password_encrypted: blockPassword(user.password),
    })),
    message: "Successfully retrieved users",
  });
};

/**
 * Handles a logout request.
 *
 * Destroys the session, effectively logging the user out.
 * Sends an OK response with a message indicating that the user was logged out successfully.
 *
 * @param {import("express").Request} req - The request object, containing the session.
 * @param {import("express").Response} res - The response object, used to send back the response.
 */
const logoutHandler = (req, res) => {
  req.session.destroy();
  return sendResponseText(res, STATUS.OK, "User logged out successfully");
};

/**
 * Handles a create review request.
 *
 * If the user is not logged in, it sends an unauthorized response indicating that the user is not logged in.
 * If the ISBN is missing, it sends a bad request response indicating that the ISBN is missing.
 * If the review comment is missing, it sends a bad request response indicating that the comment is missing.
 * If the review rating is missing, it sends a bad request response indicating that the rating is missing.
 * If the book with the given ISBN is not found, it sends a not found response indicating that the book with the given ISBN is not found.
 * If the review is successfully added, it sends an OK response with the review data and a message indicating that the review was added successfully.
 *
 * @param {import("express").Request} req - The request object, containing the session and book ISBN.
 * @param {import("express").Response} res - The response object, used to send back the response.
 */
const createReviewHandler = (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }

  const isbn = req.params.isbn;
  if (!isbn) {
    return sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing ISBN",
    });
  }
  const comment = req.body.comment;
  if (!comment) {
    return sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing comment",
    });
  }
  const rating = req.body.rating;
  if (!rating) {
    return sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing rating",
    });
  }

  const book = DB.BOOKS.find((book) => book.isbn === isbn);
  if (!book) {
    return sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Book with ISBN ${isbn} not found`,
    });
  }

  const payload = {
    id: crypto.randomUUID(),
    user: req.session.authorization.id,
    book: book.isbn,
    rating: rating,
    comment: comment,
    created_at: new Date().toISOString(),
    updated_at: null,
  };

  DB.REVIEWS.push(payload);
  for (const book of DB.BOOKS) {
    if (book.isbn === isbn) {
      DB.BOOKS[book.id].reviews = DB.REVIEWS.filter(
        (review) => review.book === isbn,
      ).map((review) => review.id);
    }
  }
  return sendResponse(req, res, STATUS.OK, {
    data: payload,
    message: "Review added successfully",
  });
};

/**
 * Updates a single review.
 *
 * @param {import("express").Request} req - The request object, containing the session and review ID.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const updateReviewHandler = (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }

  const id = req.params.id;
  if (!id) {
    return sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing Review ID",
    });
  }

  const index = DB.REVIEWS.findIndex((review) => review.id === id);
  if (index === -1) {
    return sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Review with ID ${id} not found`,
    });
  }

  const body = req.body;

  DB.REVIEWS[index] = {
    ...DB.REVIEWS[index],
    comment: body?.comment ?? DB.REVIEWS[index].comment,
    rating: body?.rating ?? DB.REVIEWS[index].rating,
    updated_at: new Date().toISOString(),
  };

  return sendResponse(req, res, STATUS.OK, {
    data: DB.REVIEWS[index],
    message: "Review updated successfully",
  });
};

/**
 * Handles a delete review request.
 *
 * If the review ID is missing, it sends a bad request response indicating that the review ID is missing.
 * If the review is not found, it sends a not found response indicating that the review with the given ID is not found.
 * If the review is successfully deleted, it sends an OK response with a message indicating that the review was deleted successfully.
 *
 * @param {import("express").Request} req - The request object, containing the review ID.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const deleteReviewHandler = (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }

  const id = req.params.isbn;
  const isISBN = validateISBN(id);
  if (!id) {
    return sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: isISBN ? "Missing ISBN" : "Missing Review ID",
    });
  }
  const index = DB.REVIEWS.findIndex((review) => review.id === id || review.book === id);
  if (index === -1) {
    return sendResponse(req, res, STATUS.NOT_FOUND, {
      message: isISBN ? `Review with ISBN ${id} not found` : `Review with ID ${id} not found`,
    });
  }
  const review = DB.REVIEWS[index];
  const book = DB.BOOKS.find((book) => book.isbn === review.book);
  book.reviews = book.reviews.filter((reviewId) => reviewId !== id);
  DB.REVIEWS.splice(index, 1);
  DB.BOOKS[book.id] = book;

  return sendResponse(req, res, STATUS.OK, {
    message: "Review deleted successfully",
  });
};

/**
 * Handles a get review by ID request.
 *
 * If the review ID is missing, it sends a bad request response indicating that the review ID is missing.
 * If the review is not found, it sends a not found response indicating that the review with the given ID is not found.
 * If the review is successfully retrieved, it sends an OK response with the review data and a message indicating that the review was retrieved successfully.
 *
 * @param {import("express").Request} req - The request object, containing the review ID.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const retrieveReviewByIDHandler = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing Review ID",
    });
  }
  const review = DB.REVIEWS.find((review) => review.id === id);
  if (!review) {
    return sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Review with ID ${id} not found`,
    });
  }
  return sendResponse(req, res, STATUS.OK, {
    data: review,
    message: "Successfully retrieved review with ID " + id,
  });
};

/**
 * Retrieves all reviews.
 *
 * Sends an OK response with all review data, including a meta object
 * containing pagination details.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object, used to send back the response.
 */

const retrieveAllReviewsHandler = (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }
  const reviews = DB.REVIEWS.filter(
    (review) => review.user === req.session.authorization.id,
  );
  return sendResponse(req, res, STATUS.OK, {
    data: reviews,
    message: "Successfully retrieved all reviews",
    meta: {
      total: DB.REVIEWS.length,
      page: 1,
      page_size: reviews.length,
      total_pages: 1,
    },
  });
};

/**
 * Retrieves all reviews by a user for a given book.
 *
 * If the user is not logged in, it sends an unauthorized response indicating that the user is not logged in.
 * If the ISBN is missing, it sends a bad request response indicating that the ISBN is missing.
 * If the reviews are successfully retrieved, it sends an OK response with the review data, a message indicating that the reviews were retrieved successfully, and a meta object containing pagination data.
 *
 * @param {import("express").Request} req - The request object, containing the book ISBN.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const retrieveAllReviewsByISBNHandler = (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }

  const isbn = req.params.isbn;
  if (!isbn) {
    return sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing ISBN",
    });
  }

  const reviews = DB.REVIEWS.filter(
    (review) =>
      review.user === req.session.authorization.id && review.book === isbn,
  );
  return sendResponse(req, res, STATUS.OK, {
    data: reviews,
    message: "Successfully retrieved all reviews",
    meta: {
      total: DB.REVIEWS.length,
      page: 1,
      page_size: reviews.length,
      total_pages: 1,
    },
  });
};

/**
 * Clears all reviews by the currently logged in user.
 *
 * If the user is not logged in, it sends an unauthorized response indicating that the user is not logged in.
 * If the reviews are successfully cleared, it sends an OK response with a message indicating that the reviews were cleared successfully.
 *
 * @param {import("express").Request} req - The request object, containing the session.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const clearReviewsHandler = (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }
  DB.REVIEWS = DB.REVIEWS.filter(
    (review) => review.user !== req.session.authorization.id,
  );
  return sendResponse(req, res, STATUS.OK, {
    message: "Clear reviews successfully",
  });
};

module.exports = {
  loginHandler,
  logoutHandler,
  readMeHandler,
  registerHandler,
  getUsersHandler,
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
  retrieveReviewByIDHandler,
  retrieveAllReviewsHandler,
  retrieveAllReviewsByISBNHandler,
  clearReviewsHandler,
};
