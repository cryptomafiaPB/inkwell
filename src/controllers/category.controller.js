/* eslint-disable no-unused-vars */
// Add a new category (admin)

import { ApiError } from "../utils/api-error.js";
import Category from "../models/categories.model.js";
import { ApiResponse } from "../utils/api-responce.js";
import slugify from "slugify";
import { categorySchema } from "../validators/categorySchema.js";

const addCategory = async (req, res) => {
  try {
    // extract category data from request body
    const { id, role } = req.user;

    if (role !== "admin") {
      throw new ApiError(403, "Forbidden");
    }

    const { title, description } = categorySchema.parse(req.body);

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    // check if category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      throw new ApiError(409, "Category already exists");
    }

    //  create a new category
    const newCategory = await Category.create({
      title,
      slug,
      description,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { category: newCategory }));
  } catch (error) {
    console.log("addCategory error: ", error);
    throw new ApiError(400, error.message);
  }
};

// List all categories (public)
const getAllCategories = async (req, res) => {
  try {
    // get all categories
    const categories = await Category.find({});

    return res.status(200).json(new ApiResponse(200, { categories }));
  } catch (error) {
    console.log("getAllCategories error: ", error);
    throw new ApiError(400, error.message);
  }
};

export { addCategory, getAllCategories };
