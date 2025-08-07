const express = require("express");
const { registerHandler } = require("../services/auth.js");
const {
  readBooksHandler,
  retrieveBookByISBNHandler,
  retrieveBookByAuthorHandler,
  retrieveBookByTitleHandler,
} = require("../services/books.js");
const { retrieveReviewByISBNHandler } = require("../services/reviews.js");
const public = express.Router();

// Register a new user
public.post("/customer/register", registerHandler);

// Get the book list available in the shop
public.get("/", readBooksHandler);

// Get book details based on ISBN
public.get("/isbn/:isbn", retrieveBookByISBNHandler);

// Get book details based on author
public.get("/author/:author", retrieveBookByAuthorHandler);

// Get all books based on title
public.get("/title/:title", retrieveBookByTitleHandler);

//  Get book review
public.get("/review/:isbn", retrieveReviewByISBNHandler);

module.exports = public;
