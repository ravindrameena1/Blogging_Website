import { deleteBlog, getAllBlogs, getBlogById, postBlog, searchBlogs, shareBlog } from "../controllers/blog.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route to post a new blog
router.route("/post").post(verifyJWT,postBlog);

// Route to get all blogs
router.route("/all").get(verifyJWT,getAllBlogs);

// search blogs by title or description
router.route("/search").get(verifyJWT,searchBlogs);

// Route to get a single blog by ID
router.route("/:id").get(getBlogById);

// Route to share a blog (increment share count)
router.route("/:id/share").put(shareBlog);

// delete a blog post by id
router.route("/:id").delete(verifyJWT,deleteBlog);

export default router;