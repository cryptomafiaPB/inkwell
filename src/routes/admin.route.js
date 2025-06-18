import { Router } from "express";

const router = Router();

router.route("/posts").get(getAllPendingPosts); // IMP - List all pending posts
router.route("/posts/:id/approve").put(updatePostById); // IMP - approve a post
router.route("/posts/:id/reject").put(updatePostById); // IMP - reject a post with optional comment

export default router;
