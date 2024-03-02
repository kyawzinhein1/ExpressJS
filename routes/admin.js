const express = require("express");
const path = require("path");

const router = express.Router();

const posts = [];

router.get("/create-post", (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", { title: "Create Post" });
});

router.post("/", (req, res) => {
  const { title, description } = req.body;
  console.log(`Title value is ${title} & description is ${description}`);
  posts.push({
    title,
    description,
  });
  res.redirect("/");
});

module.exports = { adminRoutes: router, posts };
