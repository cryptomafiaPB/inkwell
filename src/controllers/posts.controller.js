/* eslint-disable no-unused-vars */
// Create a blog post (default status: “pending”)
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-responce.js";
import Post from "../models/posts.model.js";
import slugify from "slugify";
import { postSchema, updateSchema } from "../validators/postSchema.js";

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
      throw new ApiError(409, "Post already exists");
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
      .json(new ApiResponse(201, newPost, "Post created successfully"));
  } catch (error) {
    console.error("Error creating post:", error);
    throw new ApiError(500, "Internal Server Error");
  }
};

// List published posts (public)
// Can implement pagination
const getAllPosts = async (req, res) => {
  try {
    // get all published posts
    const posts = await Post.find({ status: "approved" });

    if (!posts) {
      throw new ApiError(404, "Posts not found");
    }

    return res.status(200).json(new ApiResponse(200, { posts }));
  } catch (error) {
    console.log("getAllPosts error: ", error);
    throw new ApiError(400, error.message);
  }
};

// Get published post by id
const getPostById = async (req, res) => {
  try {
    // extract id from params
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "cannot get postId");
    }

    // get Post By Id from DB
    const post = await Post.findOne({ _id: id, status: "approved" });

    if (!post) {
      console.log("Post: ", post);

      throw new ApiError(400, "post not found!");
    }

    throw new ApiResponse(200, { post }, "post successfully found!");
  } catch (error) {
    console.log("getPostById error: ", error);
    throw new ApiError(400, error.message);
  }
};

// Edit a post (only by author, if not approved)
const updateAutherPostById = async (req, res) => {
  try {
    const { id, role } = req.user;

    const { id: postId } = req.params;

    const updates = updateSchema.parse(req.body);

    if (!postId) {
      throw new ApiError(400, "cannot get postId");
    }

    const post = await Post.findById({
      _id: postId,
      status: "pending",
      user: req.user.id,
    });

    if (!post) {
      throw new ApiError(404, "post not found!");
    }

    // If the user is not the author, check if they are an admin
    if (post.user.toString() !== id && role !== "admin") {
      throw new ApiError(403, "Not authorized to update this post");
    }

    if (post.status === "approved") {
      throw new ApiError(403, "Cannot edit an approved post");
    }

    Object.assign(post, updates);

    if (post.status === "rejected") {
      post.status = "pending"; // Reset status to pending if it was rejected
    }

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
      .json(new ApiResponse(200, { post }, "post successfully updated!"));
  } catch (error) {
    console.log("updateAutherPostById error: ", error);
    throw new ApiError(400, error.message);
  }
};

// Delete a post (only by author, if not approved)
const deletePostById = async (req, res) => {
  try {
    const { id, role } = req.user;

    const { id: postId } = req.params;

    if (!postId) {
      throw new ApiError(400, "cannot get postId");
    }

    const post = await Post.findById({
      _id: postId,
      status: "pending",
    });

    if (!post) {
      throw new ApiError(404, "post not found!");
    }

    if (post.status !== "pending") {
      throw new ApiError(403, "Not authorized to delete this post");
    }

    // If the user is not the author, check if they are an admin
    if (post.user.toString() !== id && role !== "user") {
      throw new ApiError(403, "Not authorized to delete this post");
    }

    await Post.findByIdAndDelete(postId);

    throw new ApiResponse(200, "post successfully deleted!");
  } catch (error) {
    console.log("deletePostById error: ", error);
    throw new ApiError(400, error.message);
  }
};

// Get featured posts
const getFeaturedPosts = async (req, res) => {
  try {
    console.log("getFeaturedPosts called");
    // get all published posts
    const posts = await Post.find({ status: "approved", isFeatured: true });
    if (!posts || posts.length === 0) {
      throw new ApiError(404, "Posts not found");
    }
    // return response
    return res.status(200).json(new ApiResponse(200, { posts }));
  } catch (error) {
    console.log("getFeaturedPosts error: ", error);
    throw new ApiError(400, error.message);
  }
};

export {
  createPost,
  getAllPosts,
  getPostById,
  updateAutherPostById,
  deletePostById,
  getFeaturedPosts,
};
