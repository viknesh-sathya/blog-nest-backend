import express from "express";
import postController from "./../controllers/post.controller.js";
import { increaseVisit } from "./../middlewares/increaseVisit.js";
const router = express.Router();
// Imagekit
router.get("/upload-auth", postController.uploadAuth);

router.route("/").get(postController.getPosts).post(postController.createPost);

router.route("/:slug").get(increaseVisit, postController.getPost);
router.route("/:id").delete(postController.deletePost);
router.patch("/feature", postController.featurePost);

export default router;
