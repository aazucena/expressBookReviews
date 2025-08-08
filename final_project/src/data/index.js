let BOOKS = require("./booksdb.js");

const buildDataset = (data) => {
  return Object.entries(data).map(([id, item]) => ({ id: id, ...item }));
};

class Database {
  constructor() {
    this.BOOKS = buildDataset(BOOKS);
    this.USERS = [
      {
          "id": crypto.randomUUID(),
          "username": "john",
          "password": "doe",
      }
    ];
    this.REVIEWS = [];
  }
}

const DB = new Database();

module.exports = DB;
