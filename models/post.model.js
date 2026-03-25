import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is a required field"],
    },
    img: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "title is a required field"],
    },

    slug: {
      type: String,
      required: [true, "slug is a required field"],
      unique: true,
    },
    category: {
      type: String,
      default: "general",
    },
    desc: {
      type: String,
    },
    content: {
      type: String,
      required: [true, "content is a required field"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    visit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);
export default Post;
