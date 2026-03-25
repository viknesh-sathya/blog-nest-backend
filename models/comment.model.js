import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is a required field"],
    },
    desc: {
      type: String,
      required: [true, "desc is a required field"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "post is a required field"],
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
