const jwt = require("jsonwebtoken");
const DB = require("../data/index.js");
const { sendResponse, sendResponseText } = require("../utils/index.js");
const { STATUS } = require("../variables/index.js");
const Controller = require("../controllers/auth_users.js");

const { authenticateUser, blockPassword, isValid, validateISBN } = new Controller(DB);

const loginHandler = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return await sendResponseText(
      res,
      STATUS.BAD_REQUEST,
      "Missing username or password",
    );
  }
  if (authenticateUser(username, password)) {
    const user = DB.USERS.find((user) => user.username === username);
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 },
    );
    req.session.authorization = {
      accessToken,
      username,
      id: user.id,
    };
    return await sendResponseText(res, STATUS.OK, "User logged in successfully");
  } else {
    return await sendResponseText(
      res,
      STATUS.UNAUTHORIZED,
      "Invalid Login. Check username and password",
    );
  }
};

/**
 * Handles user registration by creating a new user in the USERS collection.
 *
 * If the registration is successful, it sends a created response.
 * If the registration fails, it sends a bad request response.
 *
 * @param {import("express").Request} req - The request object, containing the username and password in the body.
 * @param {import("express").Response} res - The response object, used to send back the response.
 * @returns {Promise<void>} - The promise returned by the middleware, which is either resolved or rejected based on the registration result.
 */
const registerHandler = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username)) {
    return await sendResponseText(res, STATUS.BAD_REQUEST, "Username already exists");
  }
  if (!username || !password) {
    return await sendResponseText(
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
  return await sendResponseText(res, STATUS.CREATED, "User registered successfully");
};

/**
 * Handles a GET request to /me by retrieving the user data from the USERS collection.
 *
 * If the user is not logged in, it sends an unauthorized response indicating that the user is not logged in.
 * If the user is not found, it sends an unauthorized response indicating that the user is not logged in.
 * If the user data is successfully retrieved, it sends an OK response with the user data, a message indicating that the user data was retrieved successfully, and a context object containing the user data.
 *
 * @param {import("express").Request} req - The request object, containing the session.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const readMeHandler = async (req, res) => {
  const session = req.session;
  const auth = session.authorization;
  if (!auth) {
    return await sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }
  const username = auth.username;
  const user = DB.USERS.find((user) => user.username === username);
  if (!user) {
    return await sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "Unable to find user. User not logged in",
    });
  }
  user.password = new Array(user.password.length).fill("*").join("");
  return await sendResponse(req, res, STATUS.OK, {
    data: user,
    message: "Successfully retrieved user",
  });
};

/**
 * Handles a GET request to /users by retrieving all user data from the USERS collection.
 *
 * If the request is successful, it sends an OK response with the user data, a message indicating that the user data was retrieved successfully, and a context object containing the user data.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 *
 * @returns {Promise<void>}
 */
const getUsersHandler = async (req, res) => {
  return await sendResponse(req, res, STATUS.OK, {
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
 * Handles a GET request to /users/logout by invalidating the user's session.
 *
 * If the request is successful, it sends an OK response with a message indicating that the user was logged out successfully.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 *
 * @returns {Promise<void>}
 */
const logoutHandler = async (req, res) => {
  req.session.destroy();
  return await sendResponseText(res, STATUS.OK, "User logged out successfully");
};

/**
 * Handles a POST request to /reviews by creating a new review in the REVIEWS collection.
 *
 * If the request is successful, it sends a created response with the review data, a message indicating that the review was added successfully, and a context object containing the review data.
 *
 * @param {import("express").Request} req - The request object, containing the book ISBN and review data in the body.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const createReviewHandler = async (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return await sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }

  const isbn = req.params.isbn;
  if (!isbn) {
    return await sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing ISBN",
    });
  }
  const comment = req.body.comment;
  if (!comment) {
    return await sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing comment",
    });
  }
  const rating = req.body.rating;
  if (!rating) {
    return await sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing rating",
    });
  }

  const book = DB.BOOKS.find((book) => book.isbn === isbn);
  if (!book) {
    return await sendResponse(req, res, STATUS.NOT_FOUND, {
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
  return await sendResponse(req, res, STATUS.OK, {
    data: payload,
    message: "Review added successfully",
  });
};

const updateReviewHandler = async (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return await sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }

  const id = req.params.id;
  if (!id) {
    return await sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing Review ID",
    });
  }

  const index = DB.REVIEWS.findIndex((review) => review.id === id);
  if (index === -1) {
    return await sendResponse(req, res, STATUS.NOT_FOUND, {
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

  return await sendResponse(req, res, STATUS.OK, {
    data: DB.REVIEWS[index],
    message: "Review updated successfully",
  });
};

/**
 * Handles a DELETE request to /reviews/:id by deleting the review with the given ID or ISBN.
 *
 * If the user is not logged in, it sends an unauthorized response.
 * If the review is not found, it sends a not found response.
 * If the deletion is successful, it sends an OK response with a message indicating that the review was deleted successfully.
 *
 * @param {import("express").Request} req - The request object, containing the ID or ISBN of the review to be deleted.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const deleteReviewHandler = async (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return await sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }

  const id = req.params.isbn;
  const isISBN = validateISBN(id);
  if (!id) {
    return await sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: isISBN ? "Missing ISBN" : "Missing Review ID",
    });
  }
  const index = DB.REVIEWS.findIndex((review) => review.id === id || review.book === id);
  if (index === -1) {
    return await sendResponse(req, res, STATUS.NOT_FOUND, {
      message: isISBN ? `Review with ISBN ${id} not found` : `Review with ID ${id} not found`,
    });
  }
  const review = DB.REVIEWS[index];
  const book = DB.BOOKS.find((book) => book.isbn === review.book);
  book.reviews = book.reviews.filter((reviewId) => reviewId !== id);
  DB.REVIEWS.splice(index, 1);
  DB.BOOKS[book.id] = book;

  return await sendResponse(req, res, STATUS.OK, {
    message: "Review deleted successfully",
  });
};

/**
 * Handles a GET request to retrieve a review by its ID.
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
const retrieveReviewByIDHandler = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return await sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing Review ID",
    });
  }
  const review = DB.REVIEWS.find((review) => review.id === id);
  if (!review) {
    return await sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Review with ID ${id} not found`,
    });
  }
  return await sendResponse(req, res, STATUS.OK, {
    data: review,
    message: "Successfully retrieved review with ID " + id,
  });
};

/**
 * Handles a GET request to retrieve all reviews made by the currently logged-in user.
 *
 * If the user is not logged in, it sends an unauthorized response.
 * If the reviews are successfully retrieved, it sends an OK response with the review data, a message indicating that the reviews were retrieved successfully, and a meta object containing pagination data.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 *
 * @returns {Promise<void>}
 */
const retrieveAllReviewsHandler = async (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return await sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }
  const reviews = DB.REVIEWS.filter(
    (review) => review.user === req.session.authorization.id,
  );
  return await sendResponse(req, res, STATUS.OK, {
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
 * Handles a GET request to retrieve all reviews made by the currently logged-in user for a given book ISBN.
 *
 * If the user is not logged in, it sends an unauthorized response.
 * If the ISBN is missing, it sends a bad request response.
 * If the reviews are successfully retrieved, it sends an OK response with the review data, a message indicating that the reviews were retrieved successfully, and a meta object containing pagination data.
 *
 * @param {import("express").Request} req - The request object, containing method and path.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const retrieveAllReviewsByISBNHandler = async (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return await sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }

  const isbn = req.params.isbn;
  if (!isbn) {
    return await sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing ISBN",
    });
  }

  const reviews = DB.REVIEWS.filter(
    (review) =>
      review.user === req.session.authorization.id && review.book === isbn,
  );
  return await sendResponse(req, res, STATUS.OK, {
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
 * Handles a DELETE request to clear all reviews made by the currently logged-in user.
 *
 * If the user is not logged in, it sends an unauthorized response.
 * If the reviews are successfully cleared, it sends an OK response with a message indicating that the reviews were cleared successfully.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 *
 * @returns {Promise<void>}
 */
const clearReviewsHandler = async (req, res) => {
  const session = req.session;
  const username = session.authorization.username;
  if (!isValid(username)) {
    return await sendResponse(req, res, STATUS.UNAUTHORIZED, {
      message: "User not logged in",
      context: session,
    });
  }
  DB.REVIEWS = DB.REVIEWS.filter(
    (review) => review.user !== req.session.authorization.id,
  );
  return await sendResponse(req, res, STATUS.OK, {
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

