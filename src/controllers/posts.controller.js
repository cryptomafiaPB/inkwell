/* eslint-disable no-unused-vars */
// Create a blog post (default status: “pending”)
const createPost = (req, res) => {};

// List published posts (public)
const getAllPosts = (req, res) => {};

// Get published post by id
const getPostById = (req, res) => {};

// Edit a post (only by author, if not approved)
const updateAutherPostById = (req, res) => {};

// Delete a post (only by author, if not approved)
const deletePostById = (req, res) => {};

// Get featured posts
const getFeaturedPosts = (req, res) => {};

export {
  createPost,
  getAllPosts,
  getPostById,
  updateAutherPostById,
  deletePostById,
  getFeaturedPosts,
};
