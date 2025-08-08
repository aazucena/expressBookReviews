const express = require("express");
const {
  loginHandler,
  logoutHandler,
  readMeHandler,
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
  retrieveAllReviewsHandler,
  retrieveAllReviewsByISBNHandler,
  clearReviewsHandler,
} = require("../services/auth_users.js");
const regd_users = express.Router();

// Only registered users can login
regd_users.post("/login", loginHandler);

// Logout user
regd_users.post("/logout", logoutHandler);

// Get user details
regd_users.get("/me", readMeHandler);

// Add a book review
regd_users.post("/auth/review/:isbn", createReviewHandler);

// Delete a book review
regd_users.delete("/auth/review/:isbn", deleteReviewHandler);

// Update a book review
regd_users.patch("/auth/review/:id", updateReviewHandler);

// Get all book reviews
regd_users.get("/auth/reviews", retrieveAllReviewsHandler);

// Get all book reviews
regd_users.get("/auth/reviews/:isbn", retrieveAllReviewsByISBNHandler);

// Clear all book reviews
regd_users.post("/auth/reviews/clear", clearReviewsHandler);

module.exports = regd_users;
