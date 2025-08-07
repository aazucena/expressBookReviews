const { REVIEWS, BOOKS } = require("../data/index.js");
const { sendResponse, sendResponseText } = require("../utils/index.js");
const { STATUS } = require("../variables/index.js");
const { isValid } = require("../controllers/auth.js");

const createReviewHandler = (req, res) => {
  if (!isValid(req.session.authorization.username)) {
    return sendResponseText(res, STATUS.UNAUTHORIZED, "User not logged in");
  }

  const isbn = req.params.isbn;
  if (!isbn) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing ISBN");
  }
  const comment = req.body.comment;
  if (!comment) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing comment");
  }
  const rating = req.body.rating;
  if (!rating) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing rating");
  }

  const book = BOOKS.find((book) => book.isbn === isbn);
  if (!book) {
    return sendResponseText(
      res,
      STATUS.NOT_FOUND,
      `Book with ISBN ${isbn} not found`,
    );
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

  REVIEWS.push(payload);
  for (const book of BOOKS) {
    if (book.isbn === isbn) {
      BOOKS[book.id].reviews = REVIEWS.filter(
        (review) => review.book === isbn,
      ).map((review) => review.id);
    }
  }
  //Write your code here
  return sendResponse(req, res, STATUS.OK, {
    data: payload,
    message: "Review added successfully",
  });
};

const updateReviewHandler = (req, res) => {
  if (!isValid(req.session.authorization.username)) {
    return sendResponseText(res, STATUS.UNAUTHORIZED, "User not logged in");
  }

  const id = req.params.id;
  if (!id) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing Review ID");
  }

  const index = REVIEWS.findIndex((review) => review.id === id);
  if (index === -1) {
    return sendResponseText(
      res,
      STATUS.NOT_FOUND,
      `Review with ID ${id} not found`,
    );
  }

  const body = req.body;

  REVIEWS[index] = {
    ...REVIEWS[index],
    comment: body?.comment ?? REVIEWS[index].comment,
    rating: body?.rating ?? REVIEWS[index].rating,
    updated_at: new Date().toISOString(),
  };

  return sendResponse(req, res, STATUS.OK, {
    data: payload,
    message: "Review updated successfully",
  });
};

// Delete review
const deleteReviewHandler = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing Review ID");
  }
  const index = REVIEWS.findIndex((review) => review.id === id);
  if (index === -1) {
    return sendResponseText(
      res,
      STATUS.NOT_FOUND,
      `Review with ID ${id} not found`,
    );
  }
  const review = REVIEWS[index];
  const book = BOOKS.find((book) => book.isbn === review.book);
  book.reviews = book.reviews.filter((reviewId) => reviewId !== id);
  REVIEWS.splice(index, 1);
  BOOKS[book.id] = book;

  return sendResponseText(res, STATUS.OK, "Review deleted successfully");
};

// Get book review
const retrieveReviewByISBNHandler = (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) {
    return sendResponseText(res, STATUS.BAD_REQUEST, "Missing ISBN");
  }
  const reviews = REVIEWS.filter((review) => review.book === isbn);
  if (!reviews) {
    return sendResponseText(
      res,
      STATUS.NOT_FOUND,
      `Reviews with Book ISBN ${isbn} not found`,
    );
  }
  return sendResponse(req, res, STATUS.OK, {
    data: reviews,
    message: "Successfully retrieved reviews for the book with ISBN " + isbn,
    meta: {
      total: REVIEWS.length,
      page: 1,
      page_size: reviews.length,
      total_pages: 1,
    },
  });
};

module.exports = {
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
  retrieveReviewByISBNHandler,
};
