const { STATUS } = require("../variables/index.js");
const { BOOKS } = require("../data/index.js");
const { sendResponse } = require("../utils/index.js");

// Get the book list available in the shop
const readBooksHandler = (req, res) => {
  if (!BOOKS || BOOKS.length === 0) {
    return sendResponse(req, res, STATUS.NOT_FOUND, {
      message: "No books found",
    });
  }
  return sendResponse(req, res, STATUS.OK, {
    data: BOOKS,
    meta: {
      total: BOOKS.length,
      page: 1,
      page_size: BOOKS.length,
      total_pages: 1,
    },
  });
};

// Get book details based on ISBN
const retrieveBookByISBNHandler = (req, res) => {
  const isbn = req.params.isbn;
  const item = BOOKS.find((book) => book.isbn === isbn);

  if (!item) {
    return sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Unable to find book with ISBN "${isbn}"`,
    });
  }
  return sendResponse(req, res, STATUS.OK, {
    data: item,
    message: `Book with ISBN "${isbn}" found successfully`,
  });
};

// Get book details based on author
const retrieveBookByAuthorHandler = (req, res) => {
  const author = req.params.author;
  const items = BOOKS.filter((book) => book.author === author);

  if (!items || items.length === 0) {
    return sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Unable to find book with Author "${author}"`,
    });
  }
  return sendResponse(req, res, STATUS.OK, {
    data: items,
    meta: {
      total: BOOKS.length,
      page: 1,
      page_size: items.length,
      total_pages: 1,
    },
    message: `Book with Author "${author}" found successfully`,
  });
};

// Get all books based on title
const retrieveBookByTitleHandler = (req, res) => {
  const title = req.params.title;
  const item = BOOKS.find((book) => book.title === title);

  if (!item) {
    return sendResponse(req, res, STATUS.NOT_FOUND, {
      message: `Unable to find book with Title "${title}"`,
    });
  }
  return sendResponse(req, res, STATUS.OK, {
    data: item,
    message: `Book with Title "${title}" found successfully`,
  });
};

module.exports = {
  readBooksHandler,
  retrieveBookByISBNHandler,
  retrieveBookByAuthorHandler,
  retrieveBookByTitleHandler,
};
