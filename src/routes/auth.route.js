import { Router } from "express";
import {
  // forgotPassword,
  generateAPIKey,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  // resetPassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes

router.route("/register").post(registerUser); // IMP
router.route("/login").post(loginUser); // IMP

// Protected routes
router.route("/logout").post(authenticate, logoutUser);
// API key routes
router.route("/api-key").get(authenticate[0], generateAPIKey); // IMP only check JWT
// User routes
router.route("/me").get(authenticate, getMe); // IMP

// manual DB update for admin role.

// export routes
export default router;
