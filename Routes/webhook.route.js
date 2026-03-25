import express from "express";
import webHookController from "../controllers/webhook.controller.js";
import bodyParser from "body-parser";

const router = express.Router();
router.post(
  "/clerk",
  bodyParser.raw({ type: "application/json" }),
  webHookController.clerkWebHook,
);
export default router;
