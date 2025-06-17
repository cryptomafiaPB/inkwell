import mongoose from "mongoose";
import { trim } from "zod/v4";

const repliesSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
});

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  replies: [repliesSchema],
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
