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
 * Sends a JSON response with a specific structure, including status code,
 * message, payload, and metadata.
 *
 * @param {import("express").Request} req - The request object, containing method and path.
 * @param {import("express").Response} res - The response object, used to send back the response.
 * @param {number} status - The HTTP status code to set for the response.
 * @param {Object} [payload={}] - An optional payload object to include in the response.
 *
 * The response includes a message, status code, and additional metadata such as
 * a timestamp, API version, and request details.
 */
const sendResponse = async (req, res, status, payload = {}) => new Promise((resolve, reject) => {
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
})

/**
 * Sends a text response with a status code and optional message. If no message
 * is provided, the status message corresponding to the status code is used.
 *
 * @param {import("express").Response} res - The response object, used to send back the response.
 * @param {number} status - The HTTP status code to set for the response.
 * @param {string} [message] - An optional message to include in the response.
 */
const sendResponseText = async(res, status, message) => new Promise((resolve, reject) => {
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
