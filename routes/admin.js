const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/create-post", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
});

module.exports = router;
