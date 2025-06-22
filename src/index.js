import express from "express";
import app from "./app.js";
import cors from "cors";
import dbConnect from "./db/dbConnect.js";

// Internal routes imports
import authRouter from "./routes/auth.route.js";
import postsRouter from "./routes/posts.route.js";
import adminRouter from "./routes/admin.route.js";

// Internal controllers imports
import { getFeaturedPosts } from "./controllers/posts.controller.js";
import {
  addCategory,
  getAllCategories,
} from "./controllers/category.controller.js";
import { healthCheck } from "./controllers/healthCheck.controller.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000;

// loade env
dotenv.config({ path: ".env" });

// common middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// database connection
await dbConnect();

// ROUTES

// auth routes
app.use("/api/v1/auth", authRouter);
// posts routes
app.use("/api/v1/me", postsRouter);
// admin routes
app.use("/api/v1/admin", adminRouter);

// get Featured posts
app.route("/api/v1/posts/featured").get(getFeaturedPosts);
// category routes
app.route("/api/v1/categories").get(getAllCategories); // list all categories
app.route("/api/v1/categories").post(addCategory); // add a new category

// Health check
app.get("/api/v1/health-check", healthCheck);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
