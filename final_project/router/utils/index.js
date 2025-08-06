const { STATUS_MESSAGE, API_VERSION } = require("../variables/index.js");

const getStatusCode = (status) => {
  const data = STATUS_MESSAGE[status];
  const message = data?.message ?? "Unknown Error";
  const code = message.toUpperCase().replace(" ", "_");
  return code;
};

const getStatusMessage = (status) => {
  const data = STATUS_MESSAGE[status];
  const message = data?.description ?? "Unknown Error";
  return message;
};

const sendResponse = (req, res, status, payload = {}) => {
  const code = getStatusCode(status);
  const message = getStatusMessage(status);
  return res.status(status).json({
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
        endpoint: req.path,
      },
    },
  });
};

const sendResponseText = (res, status, message) => {
  const statusMessage = getStatusMessage(status);
  return res.status(status).send(message ?? statusMessage);
};

module.exports = {
  getStatusCode,
  getStatusMessage,
  sendResponse,
  sendResponseText,
};
