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
} = require("../services/auth.js");
const auth = express.Router();

// Only registered users can login
auth.post("/login", loginHandler);

// Logout user
auth.post("/logout", logoutHandler);

// Get user details
auth.get("/me", readMeHandler);

// Add a book review
auth.post("/auth/review/:isbn", createReviewHandler);

// Delete a book review
auth.delete("/auth/review/:id", deleteReviewHandler);

// Update a book review
auth.patch("/auth/review/:id", updateReviewHandler);

auth.get("/auth/reviews", retrieveAllReviewsHandler);

auth.get("/auth/reviews/:isbn", retrieveAllReviewsByISBNHandler);

auth.post("/auth/reviews/clear", clearReviewsHandler);

module.exports = auth;
