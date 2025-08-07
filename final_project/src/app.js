const express = require("express");
const session = require("express-session");
const auth_routes = require("./routes/auth.routes.js");
const public_routes = require("./routes/books.route.js");
const { API_PREFIX } = require("./variables/index.js");
const { userVerificationMiddleware } = require("./middlewares/auth.js");

const app = express();
app.use(express.json());
const router = express.Router();
router.use("/customer",
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

module.exports = app;