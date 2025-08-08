const app = require("./app.js");
const { PORT } = require("./variables/index.js");

/**
 * Starts the Express server and listens on the specified port.
 *
 * Logs a message to the console indicating that the server is running
 * and listening on the specified port.
 */

module.exports = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    console.log(
      `OpenAPI specification available at http://localhost:${PORT}/api-spec`,
    );
  });
};
