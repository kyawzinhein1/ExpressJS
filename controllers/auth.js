exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Hellopage" });
};

exports.postLoginData = (req, res) => {
  req.session.isLogin = true;
  res.redirect("/");
};

exports.logout = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};