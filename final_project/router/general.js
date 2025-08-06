const express = require('express');
const books = require("./booksdb.js");
const { users, isValid } = require("./auth_users.js");
const { STATUS } = require("./variables.js");
const { sendResponse } = require("./utils.js");
const public_users = express.Router();


const items = Object.entries(books).map(([_, item]) => item);


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (_req, res) {
  return sendResponse(res, STATUS.OK, { 
    data: items, 
    meta: {  
      total: items.length,
      page: 1,
      page_size: items.length,
      total_pages: 1,
    } 
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
