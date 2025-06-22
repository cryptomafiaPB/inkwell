// /* eslint-disable no-unused-vars */
// // src/middleware/error.middleware.js
// import { ApiError } from "../utils/ApiError.js";
// import mongoose from "mongoose";

// // Catch all unhandled errors
// export function errorHandler(err, req, res, next) {
//   let customError = err;

//   // Zod validation error
//   if (err.name === "ZodError") {
//     customError = new ApiError(400, "Validation Error", true, err.errors);
//   }

//   // Mongoose validation error
//   if (err instanceof mongoose.Error.ValidationError) {
//     const messages = Object.values(err.errors).map((e) => e.message);
//     customError = new ApiError(
//       400,
//       "Database Validation Error",
//       true,
//       messages
//     );
//   }

//   // Mongoose duplicate key error
//   if (err.code && err.code === 11000) {
//     const field = Object.keys(err.keyValue)[0];
//     customError = new ApiError(
//       409,
//       `Duplicate field: ${field}`,
//       true,
//       err.keyValue
//     );
//   }

//   // If not operational, mask the message
//   if (!customError.isOperational) {
//     console.error(err);
//     customError = new ApiError(500, "Internal Server Error");
//   }

//   res.status(customError.statusCode || 500).json({
//     status: "error",
//     message: customError.message,
//     details: customError.details || undefined,
//   });
// }
