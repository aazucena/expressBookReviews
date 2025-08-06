const express = require('express');
const { BOOKS, USERS, REVIEWS } = require("./data/index.js");
const { isValid } = require("./auth_users.js");
const { STATUS } = require("./variables.js");
const { sendResponse, sendResponseText } = require("./utils.js");
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username)) {
    return sendResponseText(req, res, STATUS.BAD_REQUEST, "Username already exists");
  }
  if (!username || !password) {
    return sendResponseText(req, res, STATUS.BAD_REQUEST, "Missing username or password");
  }

  USERS.push({
    id: crypto.randomUUID(),
    username,
    password
  });
  return sendResponseText(res, STATUS.CREATED, "User registered successfully");
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  if (!BOOKS || BOOKS.length === 0) {
    return sendResponse(req, res, STATUS.NOT_FOUND, { message: "No books found" });
  }
  return sendResponse(req, res, STATUS.OK, { 
    data: BOOKS, 
    meta: {  
      total: BOOKS.length,
      page: 1,
      page_size: BOOKS.length,
      total_pages: 1,
    } 
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const item = BOOKS.find(book => book.isbn === isbn);
 
  if (!item) {
    return sendResponse(req, res, STATUS.NOT_FOUND, { message: `Unable to find book with ISBN "${isbn}"` });
  }
  return sendResponse(req, res, STATUS.OK, { 
    data: item,
    message: `Book with ISBN "${isbn}" found successfully`
  });
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const items = BOOKS.filter(book => book.author === author);
 
  if (!items || items.length === 0) {
    return sendResponse(req, res, STATUS.NOT_FOUND, { message: `Unable to find book with Author "${author}"` });
  }
  return sendResponse(req, res, STATUS.OK, { 
    data: items,
    meta: {  
      total: BOOKS.length,
      page: 1,
      page_size: items.length,
      total_pages: 1,
    },
    message: `Book with Author "${author}" found successfully`
  });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const item = BOOKS.find(book => book.title === title);
 
  if (!item) {
    return sendResponse(req, res, STATUS.NOT_FOUND, { message: `Unable to find book with Title "${title}"` });
  }
  return sendResponse(req, res, STATUS.OK, { 
    data: item ,
    message: `Book with Title "${title}" found successfully`
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
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
});

module.exports.general = public_users;
