const express = require("express");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const { API_VERSION } = require("./router/variables/index.js");
const { userVerificationMiddleware } = require("./router/middlewares/auth.js");

const app = express();
app.use(express.json());
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

router.use("/customer", customer_routes);
router.use("/", genl_routes);

const version = Number(API_VERSION.split(".")[0]);
const API_PREFIX = `/api/v${version}`;
app.use(API_PREFIX, router);

const PORT = 5000;

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}${API_PREFIX}`),
);
