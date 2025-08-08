const { STATUS } = require("../variables/index.js");
const DB = require("../data/index.js");
const { sendResponse } = require("../utils/index.js");

/**
 * Retrieves all books from the database.
 *
 * @param {import("express").Request} req - The request object, containing method and path.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const readBooksHandler = async (req, res) => {
  if (!DB.BOOKS || DB.BOOKS.length === 0) {
    return await sendResponse(req, res, STATUS.NOT_FOUND, {
      message: "No books found",
    });
  }
  return await sendResponse(req, res, STATUS.OK, {
    data: DB.BOOKS,
    meta: {
      total: DB.BOOKS.length,
      page: 1,
      page_size: DB.BOOKS.length,
      total_pages: 1,
    },
  });
};

/**
 * Retrieves a single book by its ISBN.
 *
 * @param {import("express").Request} req - The request object, containing method and path.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const retrieveBookByISBNHandler = async (req, res) => {
  const isbn = req.params.isbn;
  const item = DB.BOOKS.find((book) => book.isbn === isbn);

  if (!item) {
    return await sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Unable to find book with ISBN "${isbn}"`,
    });
  }
  return await sendResponse(req, res, STATUS.OK, {
    data: item,
    message: `Book with ISBN "${isbn}" found successfully`,
  });
};

/**
 * Retrieves all books by an author.
 *
 * @param {import("express").Request} req - The request object, containing method and path.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const retrieveBookByAuthorHandler = async (req, res) => {
  const author = req.params.author;
  const items = DB.BOOKS.filter((book) => book.author === author);

  if (!items || items.length === 0) {
    return await sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Unable to find book with Author "${author}"`,
    });
  }
  return await sendResponse(req, res, STATUS.OK, {
    data: items,
    meta: {
      total: DB.BOOKS.length,
      page: 1,
      page_size: items.length,
      total_pages: 1,
    },
    message: `Book with Author "${author}" found successfully`,
  });
};

/**
 * Retrieves all books by a title.
 *
 * @param {import("express").Request} req - The request object, containing method and path.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const retrieveBookByTitleHandler = async (req, res) => {
  const title = req.params.title;
  const item = DB.BOOKS.find((book) => book.title === title);

  if (!item) {
    return await sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Unable to find book with Title "${title}"`,
    });
  }
  return await sendResponse(req, res, STATUS.OK, {
    data: item,
    message: `Book with Title "${title}" found successfully`,
  });
};

/**
 * Handles a get review by book ISBN request.
 *
 * If the ISBN is missing, it sends a bad request response indicating that the ISBN is missing.
 * If the reviews are not found, it sends a not found response indicating that the reviews with the given ISBN are not found.
 * If the reviews are successfully retrieved, it sends an OK response with the review data, a message indicating that the reviews were retrieved successfully, and a meta object containing pagination data.
 *
 * @param {import("express").Request} req - The request object, containing the book ISBN.
 * @param {import("express").Response} res - The response object, used to send back the response.
 *
 * @returns {Promise<void>}
 */
const retrieveReviewByISBNHandler = async (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) {
    return await sendResponse(req, res, STATUS.BAD_REQUEST, {
      message: "Missing ISBN",
    });
  }
  const reviews = DB.REVIEWS.filter((review) => review.book === isbn);
  if (!reviews) {
    return await sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Reviews with Book ISBN ${isbn} not found`,
    });
  }
  return await sendResponse(req, res, STATUS.OK, {
    data: reviews,
    message: "Successfully retrieved reviews for the book with ISBN " + isbn,
    meta: {
      total: DB.REVIEWS.length,
      page: 1,
      page_size: reviews.length,
      total_pages: 1,
    },
  });
};

module.exports = {
  readBooksHandler,
  retrieveBookByISBNHandler,
  retrieveBookByAuthorHandler,
  retrieveBookByTitleHandler,
  retrieveReviewByISBNHandler,
};
