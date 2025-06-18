import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = Router();

// Auth routes
router.route("register").post(registerUser); // IMP
router.route("login").post(loginUser); // IMP
router.route("logout").post(logoutUser);
router.route("forgot-password").post(forgotPassword);
router.route("reset-password").post(resetPassword);

// API key routes
router.route("api-key").post(generateAPIKey); // IMP

// User routes
router.route("me").get(getMe); // IMP

// manual DB update for admin role.

// export routes
export default router;
