import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { createComment, createPost, deleteComment, deleteLike, deletePost, getAllPost, getSingleStock, likePost } from "../controllers/post.controller.js";


const postRoutes = express.Router();

postRoutes.post("/", checkAuth, createPost);

postRoutes.get("/:postId", getSingleStock);

postRoutes.get("/", getAllPost);

postRoutes.delete("/:postId", checkAuth, deletePost);

postRoutes.post("/:postId/comments", checkAuth, createComment);

postRoutes.delete("/:postId/comments/:commentId", checkAuth, deleteComment);

postRoutes.post("/:postId/like", checkAuth, likePost);

postRoutes.delete("/:postId/like", checkAuth, deleteLike);

export default postRoutes;