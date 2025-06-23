import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";

// Catch all unhandled errors
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let customError = err;

  // Zod validation error
  if (err.name === "ZodError") {
    customError = new ApiError(400, "Validation Error", true, err.errors);
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    customError = new ApiError(
      400,
      "Database Validation Error",
      true,
      messages
    );
  }

  // Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    customError = new ApiError(
      409,
      `Duplicate field: ${field}`,
      true,
      err.keyValue
    );
  }

  if (customError instanceof ApiError) {
    res.status(customError.statusCode).json({
      // this.statusCode = statusCode;
      // this.message = message;
      statusCode: customError.statusCode,
      message: customError.message,
      success: false,
      status: "error",
      details: customError.details || undefined,
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      status: "error",
    });
  }
}
