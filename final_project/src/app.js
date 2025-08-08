const express = require("express");
const session = require("express-session");
const auth_routes = require("./routes/auth.routes.js");
const public_routes = require("./routes/public.route.js");
const { API_PREFIX } = require("./variables/index.js");
const { userVerificationMiddleware } = require("./middlewares/auth.js");
const expressOasGenerator = require("express-oas-generator");

const app = express();

app.use(express.json());expressOasGenerator.handleResponses(app, {
  swaggerDocumentOptions: {
    // Optional: customize Swagger UI appearance
    customCss: '.swagger-ui { background-color: #f0f0f0; }'
  }
});

const router = express.Router();
router.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  }),
);
router.use("/customer/auth/*", userVerificationMiddleware);
router.use("/customer", auth_routes);
router.use("/", public_routes);
app.use(API_PREFIX, router);

expressOasGenerator.handleRequests();

module.exports = app;
