import { getAuth } from "@clerk/express";
import Comment from "./../models/comment.model.js";
import User from "../models/user.model.js";

const getPostComments = async (req, res) => {
  console.log("postId : ", req.params.postId);
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });
  return res.status(200).json({
    status: "success",
    result: comments.length,
    comments,
  });
};

const addComment = async (req, res) => {
  const clerkUserId = getAuth(req).userId;
  const postId = req.params.postId;
  if (!clerkUserId)
    return res.status(401).json({
      error: "Forbidden",
      message: "You do not have permission to perform this action",
    });
  const user = await User.findOne({ clerkUserId });

  const newComment = new Comment({
    user: user?._id,
    post: postId,
    desc: req.body.desc,
  });
  const comment = await newComment.save();

  return res.status(201).json({
    status: "success",
    comment,
  });
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  //isAdmin
  const role = getAuth(req).sessionClaims?.metadata.role || "user";

  if (role === "admin") {
    await Comment.findByIdAndDelete({
      _id: id,
    });

    return res.status(204).json({
      status: "success",
      message: "Comment deleted Successfully",
      post: null,
    });
  }

  const clerkUserId = getAuth(req).userId;

  if (!clerkUserId)
    return res.status(401).json({
      error: "Forbidden",
      message: "You do not have permission to perform this action",
    });

  const user = await User.findOne({ clerkUserId });

  if (!user)
    return res.status(404).json({
      status: "failed",
      message: "User not found",
    });

  const deletedComment = await Comment.findByIdAndDelete({ _id: id });
  if (!deletedComment)
    return res.status(403).json({
      status: "failed",
      message: "You are not authorized to perform this action",
    });
  return res.status(200).json({
    status: "success",
    message: "Comment deleted successfully",
    data: null,
  });
};

const commentController = { getPostComments, addComment, deleteComment };

export default commentController;
