/* eslint-disable no-unused-vars */

import { ApiError } from "../utils/api-error.js";
import Post from "../models/posts.model.js";
import { z } from "zod";
import Comment from "../models/comments.model.js";
import { ApiResponce } from "../utils/api-responce.js";

// add a comment to a post
const addCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const commentSchema = z.object({
      content: z.string().min(1, "Content is required"),
      user: z.string(), // user id as a string
    });

    const { content, user } = commentSchema.parse(req.body);

    // Check if the post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json(new ApiError(404, "Post not found"));
    }

    const comment = await Comment.create({
      content,
      user,
      post: post._id,
    });

    return res
      .status(201)
      .json(new ApiResponce(201, comment, "Comment added successfully"));
  } catch (error) {
    console.error("addCommentById error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

// get comments for a post
const getCommentsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json(new ApiError(404, "Post not found"));
    }

    const comments = await Comment.find({
      post: post._id,
    })
      .populate("user", "fullname username avatar")
      .sort({ createdAt: -1 });
    console.log("comments: ", comments);
    return res
      .status(200)
      .json(new ApiResponce(200, comments, "Comments retrieved successfully"));
  } catch (error) {
    console.error("getCommentsById error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

export { addCommentById, getCommentsById };
