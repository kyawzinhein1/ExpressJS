const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);

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

const store = new mongoStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

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

// custom middleware(user acc)
app.use((req, res, next) => {
  User.findById("65f4fdc6bb5b1fa6bb338916").then((user) => {
    req.user = user;
    next();
  });
});

// route define
app.use("/admin", adminRoutes);
app.use(postRoutes);
app.use(authRoutes);

// connect with Mongodb
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(8080);
    console.log("Connected to Mongodb!");
    // user create
    return User.findOne().then((user) => {
      if (!user) {
        User.create({
          username: "admin",
          email: "admin@gmail.com",
          password: "admin123",
        });
      }
      return user;
    });
  })
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
