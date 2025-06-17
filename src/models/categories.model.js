import mongoose from "mongoose";
import { trim, union } from "zod/v4";
import { required } from "zod/v4-mini";
import { de } from "zod/v4/locales";

const categorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
      default:
        "https://www.shutterstock.com/image-vector/category-icon-flat-illustration-vector-600nw-2431883211.jpg",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
