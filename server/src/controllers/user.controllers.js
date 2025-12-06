import Post from "../models/post.model.js";

export const getPostsByUserController = async (req, res) => {
  try {
    const user = req.user;

    const posts = await Post.find({ author: user.id }).populate(
      "author",
      "email name"
    );

    if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
    }

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log("getPostsByUserController::Error ", error);
    return res.status(500).json({ error: "Failed to fetch user's posts" });
  }
};
