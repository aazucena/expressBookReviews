const express = require('express');
const { registerHandler } = require("./handlers/auth.js");
const {
  readBooksHandler,
  retrieveBookByISBNHandler,
  retrieveBookByAuthorHandler,
  retrieveBookByTitleHandler
} = require("./handlers/books.js");
const { retrieveReviewByISBNHandler } = require("./handlers/reviews.js");
const public_users = express.Router();



public_users.post("/register", registerHandler);

// Get the book list available in the shop
public_users.get('/', readBooksHandler);

// Get book details based on ISBN
public_users.get('/isbn/:isbn', retrieveBookByISBNHandler);
  
// Get book details based on author
public_users.get('/author/:author', retrieveBookByAuthorHandler);

// Get all books based on title
public_users.get('/title/:title', retrieveBookByTitleHandler);

//  Get book review
public_users.get('/review/:isbn', retrieveReviewByISBNHandler);

module.exports.general = public_users;
