import express from "express";
import commentController from "../controllers/comment.controller.js";
const router = express.Router();

router
  .route("/:postId")
  .get(commentController.getPostComments)
  .post(commentController.addComment);

router.route("/:id").delete(commentController.deleteComment);
export default router;
