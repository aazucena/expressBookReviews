const { STATUS_MESSAGE, API_VERSION } = require("./variables.js");

const getStatusCode = (status) => {
  const data = STATUS_MESSAGE[status];
  const message = data?.message ?? "Unknown Error";
  const code = message.toUpperCase().replace(' ', "_");
  return code;
}

const getStatusMessage = (status) => {
  const data = STATUS_MESSAGE[status];
  const message = data?.description ?? "Unknown Error";
  return message;
}

const sendResponse = (res, status, payload = {}) => {
  const code = getStatusCode(status);
  const message = getStatusMessage(status);
  return res.status(status).json({
    ...payload,
    status: status,
    code: code,
    message: message,
    meta: {
      ...(payload?.meta ?? {}),
      timestamp: new Date().toISOString(),
      version: API_VERSION.toFixed(2),
    }
  });
};

module.exports = {
  getStatusCode,
  getStatusMessage,
  sendResponse,
}