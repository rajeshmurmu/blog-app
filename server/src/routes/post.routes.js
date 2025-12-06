import express from "express";
import {
  createPostController,
  deletePostController,
  getPostByIdController,
  getPostsController,
  updatePostController,
} from "../controllers/post.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Create a new post
router
  .route("/")
  .post(authenticate, uploadImage.single("image"), createPostController);

// Get all posts
router.route("/").get(getPostsController);

// Get a single post by ID
router.route("/:postId").get(getPostByIdController);

// Update a post by ID
router
  .route("/:postId")
  .put(authenticate, uploadImage.single("image"), updatePostController);

// Delete a post by ID
router.route("/:postId").delete(authenticate, deletePostController);

export default router;
