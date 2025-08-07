const express = require("express");
const { loginHandler, logoutHandler, readMeHandler } = require("../services/auth.js");
const { createReviewHandler, updateReviewHandler, deleteReviewHandler } = require("../services/reviews.js");
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

module.exports = auth;
