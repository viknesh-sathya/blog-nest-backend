import { getAuth } from "@clerk/express";
import User from "./../models/user.model.js";

const getUserSavesPost = async (req, res) => {
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

  res.status(200).json({
    status: "success",
    savedPost: user.savedPosts,
  });
};

const savePost = async (req, res) => {
  const clerkUserId = getAuth(req).userId;
  const postId = req.body.postId;

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

  //Check already saved
  const isSaved = user.savedPosts.some((spId) => spId === postId);
  console.log(isSaved);
  if (!isSaved) {
    await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          savedPosts: postId,
        },
      },
      { new: true },
    );
  } else {
    await User.findByIdAndUpdate(
      user._id,
      {
        $pull: {
          savedPosts: postId,
        },
      },
      { new: true },
    );
  }

  res.status(200).json({
    status: "success",
    isSaved,
    message: `${isSaved ? "[Post unSaved" : "Post saved"}`,
  });
};
const updateBio = async (req, res) => {
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

  const updatedUser = await User.findByIdAndUpdate(
    { _id: user._id },
    { bio: req.body.bio },
    { new: true },
  );
  return res.status(200).json({
    status: "success",
    message: "Bio updated successfully",
    user: updatedUser,
  });
};
const userController = { getUserSavesPost, savePost, updateBio };
export default userController;
