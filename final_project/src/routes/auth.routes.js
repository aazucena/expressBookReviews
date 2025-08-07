const express = require("express");
const { loginHandler, readMeHandler } = require("../services/auth.js");
const { createReviewHandler } = require("../services/reviews.js");
const auth = express.Router();

// Only registered users can login
auth.post("/login", loginHandler);

// Get user details
auth.get("/me", readMeHandler);

// Add a book review
auth.put("/auth/review/:isbn", createReviewHandler);

module.exports = auth;
