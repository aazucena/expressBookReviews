const express = require("express");
const { loginHandler, readMeHandler } = require("./handlers/auth.js");
const { createReviewHandler } = require("./handlers/reviews.js");
const regd_users = express.Router();

//only registered users can login
regd_users.post("/login", loginHandler);

regd_users.get("/me", readMeHandler);

// Add a book review
regd_users.put("/auth/review/:isbn", createReviewHandler);

module.exports.authenticated = regd_users;
