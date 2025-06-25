import { z } from "zod/v4";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";

// Catch all unhandled errors
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let customError = err;

  // Check for Zod validation error inside ApiError or directly
  let zodError = null;

  // If the error is directly a ZodError
  if (err instanceof z.ZodError) {
    zodError = err;
  }
  // If the error is an ApiError wrapping a ZodError
  else if (err instanceof ApiError && err.details instanceof z.ZodError) {
    zodError = err.details;
  }
  // If the error object has an 'error' property that is a ZodError
  else if (err && err.error instanceof z.ZodError) {
    zodError = err.error;
  }

  if (zodError) {
    // Extract message from ZodError.message
    const position = zodError.message.search("message");
    const message = zodError.message.slice(position + 11, -7);
    customError = new ApiError(400, message, true, zodError.errors);
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
  if (err.message && err.message.includes("duplicate key error")) {
    const field = Object.keys(err.error.keyValue)[0];
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
