const BOOKS = require("./books.js");
const USERS = require("./users.js");
const REVIEWS = require("./reviews.js");

const buildDataset = (data) => {
  return Object.entries(data).map(([id, item]) => ({ id: id, ...item }));
};

const DB = {
  BOOKS: buildDataset(BOOKS),
  USERS: USERS,
  REVIEWS: REVIEWS,
};

module.exports = DB;
