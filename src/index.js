import dotenv from "dotenv";
import express from "express";
import app from "./app.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Database import
import dbConnect from "./db/dbConnect.js";

// Internal routes imports
import authRouter from "./routes/auth.route.js";
import postsRouter from "./routes/posts.route.js";
import adminRouter from "./routes/admin.route.js";

// Internal controllers imports
import {
  addCategory,
  getAllCategories,
} from "./controllers/category.controller.js";
import { healthCheck } from "./controllers/healthCheck.controller.js";

// Internal middlewares imports
import { authenticate } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import apiLimiter from "./middlewares/rateLimit.middleware.js";

// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000;

// loade env
dotenv.config({ path: ".env" });

// common middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter); // rate limiting middleware

// database connection
await dbConnect();

// ROUTES

// auth routes
app.use("/api/v1/auth", authRouter);
// posts routes
app.use("/api/v1/me", authenticate, postsRouter);
// admin routes
app.use("/api/v1/admin", authenticate, adminRouter);

// category routes
app
  .route("/api/v1/categories")
  .all(authenticate) // authenticate all category routes
  .get(getAllCategories) // list all categories
  .post(addCategory); // add a new category

// Health check
app.get("/api/v1/health-check", healthCheck);

// global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
