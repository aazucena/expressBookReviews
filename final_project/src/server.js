const app = require("./app.js");
const { PORT } = require("./variables/index.js");

module.exports = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}