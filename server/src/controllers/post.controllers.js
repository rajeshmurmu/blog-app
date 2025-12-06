import { ZodError } from "zod";
import { createPostSchema } from "../utils/post.schema.js";
import Post from "../models/post.model.js";
import {
  deleteAllImageWithFolder,
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import fs from "fs/promises";

export const getPostsController = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email name");
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const createPostController = async (req, res) => {
  try {
    const user = req.user;
    const { title = "", content = "", slug = "" } = req.body;
    const file = req.file;

    const validate = createPostSchema.safeParse({
      title,
      content,
      slug,
      image: file,
    });

    if (!validate.success) {
      const { errors } = validate.error;
      return res.status(400).json({ errors });
    }

    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newPost = new Post({
      title,
      content,
      slug,
      author: user.id,
    });

    if (imageUrl) {
      const cloudinaryImageUrl = await uploadImageToCloudinary({
        filePath: imageUrl,
        product_id: newPost._id,
      });
      newPost.imageUrl = cloudinaryImageUrl;
    }

    await User.findByIdAndUpdate(user._id, {
      $push: { posts: newPost._id },
    });

    await newPost.save();

    return res
      .status(201)
      .json({ success: true, message: "Post created successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(500).json({ error: error.message });
    }
    throw new Error(error);
  } finally {
    await fs.unlink(req?.file?.path); // delete local image in any case
  }
};

export const getPostByIdController = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("author", "email name");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch the post" });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== user.id.toString()) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    await Post.findByIdAndDelete(postId);

    await User.findByIdAndUpdate(user._id, {
      $pull: { posts: postId },
    });

    if (post?.imageUrl) {
      await deleteAllImageWithFolder({ product_id: post._id });
    }

    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete the post" });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    const { title = "", content = "", slug = "" } = req.body;
    const file = req?.file;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== user.id.toString()) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    if (title !== "") post.title = title;
    if (content !== "") post.content = content;
    if (slug !== "") post.slug = slug;

    if (file && file.path) {
      // delete previous image from cloudinary
      if (post?.imageUrl) {
        await deleteImageFromCloudinary(post.imageUrl);
      }

      // upload new image to cloudinary
      const cloudinaryImageUrl = await uploadImageToCloudinary({
        filePath: file.path,
        product_id: post._id,
      });
      post.imageUrl = cloudinaryImageUrl;
    }

    await post.save();

    return res
      .status(200)
      .json({ success: true, message: "Post updated successfully", post });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to update the post" });
  } finally {
    if (req?.file?.path) {
      await fs.unlink(req?.file?.path);
    }
  }
};
