/* eslint-disable no-unused-vars */
// Add a new category (admin)

import { z } from "zod/v4";
import { ApiError } from "../utils/api-error.js";
import Category from "../models/categories.model.js";
import { ApiResponce } from "../utils/api-responce.js";
import slugify from "slugify";

const categorySchema = z.object({
  title: z.string().min(2).max(50).trim(),
  description: z.string().min(10).max(1600).trim(),
});

const addCategory = async (req, res) => {
  try {
    // extract category data from request body
    const { title, description } = categorySchema.parse(req.body);

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    // check if category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(409).json(new ApiError(409, "Category already exists"));
    }

    //  create a new category
    const newCategory = await Category.create({
      title,
      slug,
      description,
    });

    return res
      .status(201)
      .json(new ApiResponce(201, { category: newCategory }));
  } catch (error) {
    console.log("addCategory error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

// List all categories (public)
const getAllCategories = async (req, res) => {
  try {
    // get all categories
    const categories = await Category.find({});

    return res.status(200).json(new ApiResponce(200, { categories }));
  } catch (error) {
    console.log("getAllCategories error: ", error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

export { addCategory, getAllCategories };
