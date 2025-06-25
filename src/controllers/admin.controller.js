/* eslint-disable no-unused-vars */

import { z } from "zod/v4";
import PostReview from "../models/post_reviews.model.js";
import Post from "../models/posts.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-responce.js";
import { postReviewStatusEnum, PostStatusEnum } from "../utils/constants.js";

// List all pending posts
const getAllPendingPosts = async (req, res) => {
  try {
    // check if user is admin
    if (req.user.role !== "admin") {
      throw new ApiError(403, "Forbidden");
    }

    // get all pending posts
    const posts = await Post.find({ status: "pending" });

    // return response
    return res.status(200).json(new ApiResponse(200, { posts }));
  } catch (error) {
    console.log("getAllPendingPosts error: ", error);
    throw new ApiError(error.statusCode, error.message);
  }
};
// based on /approve or /reject endpoint, update a post status
const updateAdminPostById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      throw new ApiError(403, "Forbidden");
    }

    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "cannot get postId");
    }

    const isApproved = req.path.endsWith("/approve");
    const isRejected = req.path.endsWith("/reject");

    if (!isApproved && !isRejected) {
      throw new ApiError(400, "Invalid endpoint");
    }

    const post = await Post.findById(id);
    let postReview = null;
    if (!post) {
      throw new ApiError(404, "post not found!");
    }

    if (isApproved) {
      post.status = PostStatusEnum.APPROVED;
      await post.save();
      //   Save approval in post_reviews
      const postReview = await PostReview.create({
        post: post._id,
        admin: req.user.id,
        status: postReviewStatusEnum.APPROVED,
        content: "Post approved",
      });
    } else if (isRejected) {
      post.status = PostStatusEnum.REJECTED;
      await post.save();

      //   Save rejection comment in post_reviews
      const { comment } = z
        .object({
          comment: z.string().min(2).max(800).trim(),
        })
        .parse(req.body);

      if (comment && comment.trim().length > 0) {
        postReview = await PostReview.create({
          content: comment,
          admin: req.user.id,
          post: post._id,
          action: postReviewStatusEnum.REJECTED,
        });
      }
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { post, postReview },
          `Post ${isApproved ? "approved" : "rejected"} successfully`
        )
      );
  } catch (error) {
    console.log("updateAdminPostById error: ", error);
    throw new ApiError(error.statusCode, error.message);
  }
};

export { getAllPendingPosts, updateAdminPostById };
