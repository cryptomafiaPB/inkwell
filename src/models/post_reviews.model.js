import mongoose from "mongoose";
import { AvailablePostReviewStatus } from "../utils/constants.js";

const postReviewSchema = mongoose.Schema({
  content: {
    type: String,
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
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const PostReview = mongoose.model("PostReview", postReviewSchema);

export default PostReview;
