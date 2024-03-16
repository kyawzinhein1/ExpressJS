const Post = require("../models/post");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  Post.create({ title, description, imgUrl: photo, userId: req.user })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("addPost", { title: "Create Post" });
};

exports.renderHomePage = (req, res) => {
  // isLogin = true
  // const cookie = req.get("Cookie").split("=")[1].trim() === "true";
  Post.find()
    .select("title")
    .populate("userId", "username")
    .sort({ title: 1 })
    .then((posts) => {
      res.render("home", {
        title: "Hellopage",
        postsArr: posts,
        isLogin: req.session.isLogin ? true : false,
      });
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => res.render("details", { title: post.title, post }))
    .catch((err) => console.log(err));
};

exports.getEditPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("edit", { title: post.title, post });
    })
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  const { postId, title, description, photo } = req.body;

  Post.findById(postId)
    .then((post) => {
      post.title = title;
      post.description = description;
      post.imgUrl = photo;
      return post.save();
    })
    .then((result) => {
      console.log("Post updated");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  Post.findByIdAndDelete(postId)
    .then(() => {
      console.log("Post deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};