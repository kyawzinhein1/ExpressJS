exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Hellopage" });
};

exports.postLoginData = (req, res) => {
  res.setHeader("Set-Cookie", "isLogin=true");
  res.redirect("/");
};
