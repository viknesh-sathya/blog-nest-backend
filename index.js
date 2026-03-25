import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import webHookRouter from "./Routes/webhook.route.js";
import userRouter from "./Routes/user.route.js";
import postRouter from "./Routes/post.route.js";
import commentRouter from "./Routes/comment.route.js";
import connectDB from "./lib/connectDB.js";
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";

dotenv.config({ path: "./.env" });
console.log(process.env.NODE_ENV);

const app = express();
// MIDDLEWARES
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(clerkMiddleware());
app.use(morgan("dev"));
app.use("/webhooks", webHookRouter);
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: error.status,
    message: error.message || "Something went very wrong",
    stack: process.env.NODE_ENV === "development" ? error.stack : null,
  });
});
// SERVER
const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🏃‍♂️ Server running on port ${port}...`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  });
