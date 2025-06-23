import mongoose from "mongoose";
import { AvailablePostReviewStatus } from "../utils/constants.js";

const postReviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  action: {
    type: String,
    enum: AvailablePostReviewStatus,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const PostReview = mongoose.model("PostReview", postReviewSchema);

export default PostReview;
