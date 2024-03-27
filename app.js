const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();

// engine
app.set("view engine", "ejs");
app.set("views", "views");

// routes
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

// model
const User = require("./models/user");

// controller
const errorController = require("./controllers/error");

// middleware
const { isLogin } = require("./middleware/is-login");
const { render } = require("ejs");

const store = new mongoStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const csrfProtect = csrf();

// middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrfProtect);
app.use(flash());

// custom middleware(user acc)
app.use((req, res, next) => {
  if (req.session.isLogin === undefined) {
    return next();
  }
  User.findById(req.session.userInfo._id)
    .select("_id email")
    .then((user) => {
      req.user = user;
      // console.log(req.user);
      next();
    });
});

// to send csrf token for every page render
app.use((req, res, next) => {
  res.locals.isLogin = req.session.isLogin ? true : false;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// route define
app.use("/admin", isLogin, adminRoutes);
app.use(postRoutes);
app.use(authRoutes);

app.all("*", errorController.getErrorPage);

app.use(errorController.get500Page);

// connect with Mongodb
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(8080);
    console.log("Connected to Mongodb!");
  })
  .catch((err) => console.log(err));
