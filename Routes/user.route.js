import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.route("/saved").get(userController.getUserSavesPost);
router.route("/save").patch(userController.savePost);
router.route("/bio").patch(userController.updateBio);

export default router;
