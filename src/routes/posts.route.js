import { Router } from "express";
import { createPost } from "../controllers/posts.controller";

const router = Router();

router.route("/posts").post(createPost); // IMP - create a blog post
router.route("/posts").get(getAllPosts); // IMP - list published posts (Public)
router.route("/posts/:id").get(getPostById); // IMP - get published post by id
router.route("/posts/:id").put(updatePostById); // IMP - edit a post (only by author, if not approved)
router.route("/posts/:id").delete(deletePostById); // IMP - delete a post (only by author, if not approved)

export default router;
