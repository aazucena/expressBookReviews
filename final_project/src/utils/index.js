const { STATUS_MESSAGE, API_VERSION } = require("../variables/index.js");

/**
 * Retrieves the code of a status message from the STATUS_MESSAGE object.
 *
 * @param {number} status - The status code
 * @returns {string} The code of the status message, or "UNKNOWN_ERROR" if not found
 */
const getStatusCode = (status) => {
  const data = STATUS_MESSAGE[status];
  const message = data?.message ?? "Unknown Error";
  const code = message.toUpperCase().replace(" ", "_");
  return code;
};

/**
 * Retrieves the description of a status code from the STATUS_MESSAGE object.
 *
 * @param {number} status - The status code
 * @returns {string} The description of the status code, or "Unknown Error" if not found
 */
const getStatusMessage = (status) => {
  const data = STATUS_MESSAGE[status];
  const message = data?.description ?? "Unknown Error";
  return message;
};

/**
 * Sends a response with a status code and optional payload.
 *
 * The response is wrapped in a Promise that resolves if the response is sent
 * successfully, or rejects if there is an error.
 *
 * The payload is merged with a few default values into the response JSON:
 * - code: the code of the status message
 * - message: the description of the status message
 * - meta: an object containing information about the request and response
 *   - timestamp: the current time
 *   - version: the API version
 *   - request: an object containing information about the request
 *     - method: the HTTP method of the request
 *     - path: the path of the request
 *     - url: the full URL of the request
 *     - query: the query string of the request
 *     - body: the body of the request
 *     - params: the URL parameters of the request
 *     - headers: the headers of the request
 *
 * @param {import("express").Request} req - The request object, used to get information about the request
 * @param {import("express").Response} res - The response object, used to send back the response
 * @param {number} status - The HTTP status code to set for the response
 * @param {object} [payload] - An optional object to include in the response JSON
 *
 * @returns {Promise<import("express").Response>} A promise that resolves if the response is sent successfully, or rejects if there is an error
 */
const sendResponse = async (req, res, status, payload = {}) =>
  new Promise((resolve, reject) => {
    try {
      const code = getStatusCode(status);
      const message = getStatusMessage(status);
      const response = res.status(status).json({
        message: message,
        ...payload,
        status: status,
        code: code,
        meta: {
          ...(payload?.meta ?? {}),
          timestamp: new Date().toISOString(),
          version: `${API_VERSION}`,
          request: {
            method: req.method,
            path: req.path,
            url: req.url,
            query: req.query,
            body: req.body,
            params: req.params,
            headers: req.headers,
          },
        },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Sends a text response with the specified status code and optional message.
 * If no message is provided, it will use the default status message for the given status code.
 *
 * @param {import("express").Response} res - The response object, used to send back the response
 * @param {number} status - The HTTP status code to set for the response
 * @param {string} [message] - An optional message to include in the response text
 *
 * @returns {Promise<import("express").Response>} A promise that resolves if the response is sent successfully, or rejects if there is an error
 */
const sendResponseText = async (res, status, message) =>
  new Promise((resolve, reject) => {
    try {
      const statusMessage = getStatusMessage(status);
      resolve(res.status(status).send(message ?? statusMessage));
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  getStatusCode,
  getStatusMessage,
  sendResponse,
  sendResponseText,
};
