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

  // posts.push({
  //   id: Math.random(),
  //   title,
  //   description,
  //   photo,
  // });
  // res.redirect("/");
};

exports.renderCreatePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
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
