/* eslint-disable no-unused-vars */

import PostReview from "../models/post_reviews.model.js";
import Post from "../models/posts.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponce } from "../utils/api-responce";
import { postReviewStatusEnum, PostStatusEnum } from "../utils/constants.js";

// List all pending posts
const getAllPendingPosts = async (req, res) => {
  try {
    // check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json(new ApiError(403, "Forbidden"));
    }

    // get all pending posts
    const posts = await Post.find({ status: "pending" });

    // return response
    return res.status(200).json(new ApiResponce(200, { posts }));
  } catch (error) {
    console.log("getAllPendingPosts error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};
// based on /approve or /reject endpoint, update a post status
const updateAdminPostById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json(new ApiError(403, "Forbidden"));
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json(new ApiError(400, "cannot get postId"));
    }

    const isApproved = req.path.endsWith("/approve");
    const isRejected = req.path.endsWith("/reject");

    if (!isApproved && !isRejected) {
      return res.status(400).json(new ApiError(400, "Invalid endpoint"));
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json(new ApiError(404, "post not found!"));
    }

    if (isApproved) {
      post.status = PostStatusEnum.APPROVED;
      await post.save();
    } else if (isRejected) {
      post.status = PostStatusEnum.REJECTED;
      await post.save();

      //   Save rejection comment in post_reviews
      const { comment } = req.body;

      if (comment && comment.trim().length > 0) {
        await PostReview.create({
          content: comment,
          post: post._id,
          action: postReviewStatusEnum.REJECTED,
        });
      }
    }

    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          { post },
          `Post ${isApproved ? "approved" : "rejected"} successfully`
        )
      );
  } catch (error) {
    console.log("updateAdminPostById error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

export { getAllPendingPosts, updateAdminPostById };
