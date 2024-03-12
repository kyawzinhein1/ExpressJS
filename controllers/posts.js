const posts = [];
const Post = require("../models/post");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  const post = new Post(title, description, photo);

  post
    .create()
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("addPost", { title: "Create Post" });
};

exports.renderHomePage = (req, res) => {
  Post.getPosts()
    .then((posts) =>
      res.render("home", { title: "Hellopage", postsArr: posts })
    )
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const postId = req.params.postId;
  Post.getPost(postId)
    .then((post) => res.render("details", { title: post.title, post }))
    .catch((err) => console.log(err));
};

exports.getEditPost = (req, res) => {
  const postId = req.params.postId;
  Post.getPost(postId)
    .then((post) => res.render("edit", { title: post.title, post }))
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  const { postId, title, description, photo } = req.body;
  const post = new Post(title, description, photo, postId);

  post
    .create()
    .then((result) => {
      console.log("Post updated");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  Post.deleteById(postId)
    .then(() => {
      console.log("Post deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
