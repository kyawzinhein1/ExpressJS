const bcrypt = require("bcrypt");
const User = require("../models/user");

// render register page
exports.getRegisterPage = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    errMsg: req.flash("error"),
  });
};

// handle register
exports.registerAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email is already have an account");
        return res.redirect("/register");
      }
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          return User.create({
            email,
            password: hashedPassword,
          });
        })
        .then((_) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

// render login page
exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Hellopage", errMsg: req.flash("error") });
};

// handle login
exports.postLoginData = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Check your login informations and try again");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.isLogin = true;
            req.session.userInfo = user;
            return req.session.save((err) => {
              res.redirect("/");
              console.log(err);
            });
          }
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// handle logout
exports.logout = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};
