/* eslint-disable no-unused-vars */
// Create a blog post (default status: “pending”)
import { z } from "zod/v4";
import { ApiError } from "../utils/api-error.js";
import { ApiResponce } from "../utils/api-responce.js";
import Post from "../models/posts.model.js";
import slugify from "slugify";

const postSchema = z.object({
  title: z.string().min(3).max(100).trim(),
  content: z.string().min(10).max(8000).trim(),
  category: z.string(), // Assuming category is a string ID
  user: z.string(), // Assuming user is a string ID
});

const createPost = async (req, res) => {
  try {
    // Extract post data from request body
    const { title, content, category, user } = postSchema.parse(req.body);

    // console.log(title, content, category, user);

    // generate a slug from the title
    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Check if a post with the same slug already exists
    const existingPost = await Post.findOne({ slug });

    if (existingPost) {
      return res.status(409).json(new ApiError(409, "Post already exists"));
    }

    // Create a new post with default status "pending"
    const newPost = await Post.create({
      title,
      slug,
      content,
      category,
      user,
    });

    return res
      .status(201)
      .json(new ApiResponce(201, newPost, "Post created successfully"));
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// List published posts (public)
// Can implement pagination
const getAllPosts = async (req, res) => {
  try {
    // get all published posts
    const posts = await Post.find({ status: "approved" });

    if (!posts) {
      return res.status(404).json(new ApiError(404, "Posts not found"));
    }

    return res.status(200).json(new ApiResponce(200, { posts }));
  } catch (error) {
    console.log("getAllPosts error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

// Get published post by id
const getPostById = async (req, res) => {
  try {
    // extract id from params
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(new ApiError(400, "cannot get postId"));
    }

    // get Post By Id from DB
    const post = await Post.findOne({ _id: id, status: "approved" });

    if (!post) {
      console.log("Post: ", post);

      return res.status(400).json(new ApiError(400, "post not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponce(200, { post }, "post successfully found!"));
  } catch (error) {
    console.log("getPostById error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

// Edit a post (only by author, if not approved)
const updateAutherPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(new ApiError(400, "cannot get postId"));
    }

    const updateSchema = z.object({
      user_id: z.string(),
      title: z.string().min(3).max(100).trim().optional(),
      content: z.string().min(10).max(8000).trim().optional(),
      category: z.string().optional(),
    });

    const updates = updateSchema.parse(req.body);

    const post = await Post.findById({
      _id: id,
      status: "pending",
      user: updates.user_id,
    });

    if (!post) {
      return res.status(404).json(new ApiError(404, "post not found!"));
    }

    if (post.user.toString() !== updates.user_id) {
      return res
        .status(403)
        .json(new ApiError(403, "Not authorized to update this post"));
    }

    if (post.status !== "pending") {
      return res
        .status(403)
        .json(new ApiError(403, "Not authorized to update this post"));
    }

    Object.assign(post, updates);

    // If title is updated, update slug as well
    if (updates.title) {
      post.slug = slugify(updates.title, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    await post.save();

    return res
      .status(200)
      .json(new ApiResponce(200, { post }, "post successfully updated!"));
  } catch (error) {
    console.log("updateAutherPostById error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

// Delete a post (only by author, if not approved)
const deletePostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(new ApiError(400, "cannot get postId"));
    }

    const post = await Post.findById({
      _id: id,
      status: "pending",
    });

    if (!post) {
      return res.status(404).json(new ApiError(404, "post not found!"));
    }

    if (post.status !== "pending") {
      return res
        .status(403)
        .json(new ApiError(403, "Not authorized to delete this post"));
    }

    await post.remove();

    return res
      .status(200)
      .json(new ApiResponce(200, { post }, "post successfully deleted!"));
  } catch (error) {
    console.log("deletePostById error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

// Get featured posts
const getFeaturedPosts = (req, res) => {};

export {
  createPost,
  getAllPosts,
  getPostById,
  updateAutherPostById,
  deletePostById,
  getFeaturedPosts,
};
