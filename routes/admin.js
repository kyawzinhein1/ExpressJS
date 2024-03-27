const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const postController = require("../controllers/post");

// admin/create-post
router.get("/create-post", postController.renderCreatePage);

router.post(
  "/",
  [
    body("title")
      .isLength({ min: 10 })
      .trim()
      .withMessage("Title must have 10 letters"),
    body("photo").isURL().withMessage("Image must be a valid URL"),
    body("description")
      .isLength({ min: 30 })
      .trim()
      .withMessage("Description must have 30 letters"),
  ],
  postController.createPost
);

router.get("/edit-post/:postId", postController.getEditPost);

router.post(
  "/edit-post",
  [
    body("title")
      .isLength({ min: 10 })
      .trim()
      .withMessage("Title must have 10 letters"),
    body("photo").isURL().withMessage("Image must be a valid URL"),
    body("description")
      .isLength({ min: 30 })
      .trim()
      .withMessage("Description must have 30 letters"),
  ],
  postController.updatePost
);

router.post("/delete/:postId", postController.deletePost);

module.exports = router;
