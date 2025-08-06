const { REVIEWS, BOOKS } = require("../data/index.js");
const { sendResponse, sendResponseText } = require("../utils/index.js");
const { STATUS } = require("../variables/index.js");
const { isValid } = require("../services/auth.js");

const createReviewHandler = (req, res) => {
  if (!isValid(req.session.authorization.username)) {
    return sendResponseText(res, STATUS.UNAUTHORIZED, "User not logged in");
  }

  const isbn = req.params.isbn;
  if (!isbn) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing ISBN");
  }
  const message = req.body.message;
  if (!message) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing review text");
  }
  const book = BOOKS.find((book) => book.isbn === isbn);
  if (!book) {
    return sendResponseText(res, STATUS.NOT_FOUND, `Book with ISBN ${isbn} not found`);
  }

  const payload = {
    id: crypto.randomUUID(),
    user: req.session.authorization.id,
    book: book.isbn,
    message: message,
    created_at: new Date().toISOString(),
    updated_at: null,
    deleted_at: null,
  }

  REVIEWS.push(payload);
  for (const book of BOOKS) {
    if (book.isbn === isbn) {
      BOOKS[book.id].reviews = REVIEWS.filter((review) => review.book === isbn).map((review) => review.id);
    }
  }
  //Write your code here
  return sendResponse(req, res, STATUS.OK, { data: payload, message: "Review added successfully" });
};

// Get book review
const retrieveReviewByISBNHandler = (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing ISBN");
  }
  const reviews = REVIEWS.filter((review) => review.book === isbn);
  if (!reviews) {
    return sendResponseText(res, STATUS.NOT_FOUND, `Reviews with Book ISBN ${isbn} not found`);
  }
  return sendResponse(req, res, STATUS.OK, { 
    data: reviews,
    message: "Successfully retrieved reviews for the book with ISBN " + isbn,
    meta: {
      total: REVIEWS.length,
      page: 1,
      page_size: reviews.length,
      total_pages: 1,
    }
  });
};

module.exports = {
  createReviewHandler,
  retrieveReviewByISBNHandler,
}