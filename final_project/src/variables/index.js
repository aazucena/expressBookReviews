const STATUS = require("./status.js");
const STATUS_MESSAGE = require("./status_messages.js");

const API_VERSION = "1.0.0";
const version = Number(API_VERSION.split(".")[0]);
const API_PREFIX = `/api/v${version}`;

const PORT = 5000;

module.exports = {
  STATUS,
  STATUS_MESSAGE,
  API_VERSION,
  API_PREFIX,
  PORT,
};
