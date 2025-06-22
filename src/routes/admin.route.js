import { Router } from "express";
import {
  getAllPendingPosts,
  updateAdminPostById,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/posts").get(getAllPendingPosts); // IMP - List all pending posts
router.route("/posts/:id/approve").put(updateAdminPostById); // IMP - approve a post
router.route("/posts/:id/reject").put(updateAdminPostById); // IMP - reject a post with optional comment

export default router;
