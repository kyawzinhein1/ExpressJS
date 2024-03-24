const bcrypt = require("bcrypt");
const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { log } = require("console");
const dotenv = require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

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
          transporter.sendMail(
            {
              from: process.env.SENDER_MAIL,
              to: email,
              subject: "Register Account Success",
              html: "<h1>Register account successful</h1><p>Hi! , your account is successfully created, Thank you for registering at Blog.io</p>",
            },
            (err) => {
              console.log(err);
            }
          );
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

// render reset password
exports.getResetPage = (req, res) => {
  res.render("auth/reset", {
    title: "Reset Password",
    errMsg: req.flash("error"),
  });
};

// render feedback page
exports.getFeedbackPage = (req, res) => {
  res.render("auth/feedback", {
    title: "Success",
  });
};

// reset password link send
exports.resetLinkSend = (req, res) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No Account found with this Email");
          return res.redirect("/reset-password");
        }
        user.resetToken = token;
        user.tokenExpiration = Date.now() + 1800000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/feedback");
        transporter.sendMail(
          {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Reset Password",
            html: `<h1>Reset Password</h1><p>Change your account password by clicking the link below</p><a 
            href="http://localhost:8080/reset-password/${token}" target="_blink">Click to change password</a>`,
          },
          (err) => {
            console.log(err);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// render new password page
exports.getNewPasswordPage = (req, res) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, tokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      res.render("auth/new-password", {
        title: "Change Password",
        errMsg: req.flash("error"),
        resetToken: token,
        user_id: user._id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.changeNewPassword = (req, res) => {
  const { password, comfirm_password, user_id, resetToken } = req.body;
  let resetUser;

  User.findOne({
    resetToken,
    tokenExpiration: { $gt: Date.now() },
    _id: user_id,
  })
    .then((user) => {
      if (password === comfirm_password) {
        resetUser = user;
        return bcrypt.hash(password, 10);
      }
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.tokenExpiration = undefined;
      return resetUser.save();
    })
    .then(_ => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
