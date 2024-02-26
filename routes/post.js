const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
});

router.get("/post", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "postpage.html"));
});

module.exports = router;
