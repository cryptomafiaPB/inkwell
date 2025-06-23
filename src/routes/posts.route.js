import { Router } from "express";
import {
  createPost,
  deletePostById,
  getAllPosts,
  getFeaturedPosts,
  getPostById,
  updateAutherPostById,
} from "../controllers/posts.controller.js";
import {
  addCommentById,
  getCommentsById,
} from "../controllers/comments.controller.js";

const router = Router();

router.route("/posts").post(createPost); // IMP - create a blog post
router.route("/posts").get(getAllPosts); // IMP - list published posts (Public)
router.route("/posts/:id").get(getPostById); // IMP - get published post by id
router.route("/posts/:id").put(updateAutherPostById); // IMP - edit a post (only by author, if not approved)
router.route("/posts/:id").delete(deletePostById); // IMP - delete a post (only by author, if not approved)

router.route("/featured").get(getFeaturedPosts); // get featured posts (Public)

// Comments routes
router.route("/posts/:id/comments").post(addCommentById); //   add a comment to a post
router.route("/posts/:id/comments").get(getCommentsById); //  get comments for a post

export default router;
