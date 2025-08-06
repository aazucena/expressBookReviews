const express = require('express');
const { BOOKS, USERS, REVIEWS } = require("./data/index.js");
const { loginHandler } = require("./handlers/auth.js");
const { isValid } = require("./services/auth.js");
const { sendResponse, sendResponseText } = require('./utils.js');
const regd_users = express.Router();


//only registered users can login
regd_users.post("/login", loginHandler);

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
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
});

module.exports.authenticated = regd_users;
