/* eslint-disable no-unused-vars */

import { ApiError } from "../utils/api-error.js";
import Post from "../models/posts.model.js";
import { z } from "zod";
import Comment from "../models/comments.model.js";
import { ApiResponse } from "../utils/api-responce.js";
import { commentSchema } from "../validators/commentSchema.js";

// add a comment to a post approved post
const addCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { content, user } = commentSchema.parse(req.body);

    // Check if the post exists
    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    // Check if the post is approved
    if (post.status !== "approved") {
      throw new ApiError(403, "Comments can only be added to approved posts");
    }

    const comment = await Comment.create({
      content,
      user,
      post: post._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, comment, "Comment added successfully"));
  } catch (error) {
    console.error("addCommentById error: ", error);
    throw new ApiError(400, error.message);
  }
};

// get comments for a post
const getCommentsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the post exists
    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const comments = await Comment.find({
      post: post._id,
    })
      .populate("user", "fullname username avatar")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
  } catch (error) {
    console.error("getCommentsById error: ", error);
    throw new ApiError(400, error.message);
  }
};

export { addCommentById, getCommentsById };
