import { getAuth } from "@clerk/express";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import ImageKit from "imagekit";
import slugify from "slugify";

const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit);

  const query = {};

  const { cat } = req.query;
  const { author } = req.query;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const { featured } = req.query;

  if (cat) query.category = cat;
  if (searchQuery) query.title = { $regex: searchQuery, $options: "i" }; // i=caseinsensitve and regex will search for all the queries with that
  if (author) {
    const user = await User.findOne({ username: author }).select("_id");
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        query.createdAt = {
          // 1 week timeframe
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }
  if (featured) {
    query.isFeatured = true;
  }
  const posts = await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  //this we need for tanstack query infinite scroll
  const totalPost = await Post.countDocuments();
  const hasMore = page * limit < totalPost;

  res.status(200).json({
    status: "success",
    result: posts.length,
    posts,
    hasMore,
  });
};

const getPost = async (req, res) => {
  const slug = req.params.slug;
  const post = await Post.findOne({ slug }).populate(
    "user",
    "username img bio",
  );
  res.status(200).json({
    status: "success",
    post,
  });
};

const createPost = async (req, res) => {
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

  let slug = slugify(req.body.title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let existingPost = await Post.findOne({ slug });
  let counter = 2;
  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }
  const post = await Post.create({ ...req.body, user: user._id, slug });
  res.status(200).json({
    status: "success",
    post,
  });
};

const featurePost = async (req, res) => {
  const clerkUserId = getAuth(req).userId;
  const { postId } = req.body;

  if (!clerkUserId)
    return res.status(401).json({
      error: "Unauthorized",
      message: "You do not have permission to perform this action",
    });

  //isAdmin
  const role = getAuth(req).sessionClaims?.metadata.role || "user";

  if (role !== "admin") {
    return res.status(403).json({
      error: "Unauthorized",
      message: "Only admins can feature posts",
    });
  }
  const post = await Post.findById(postId);

  if (!post) {
    res.status(404).json({
      error: "failed",
      message: "Page not found",
    });
  }
  const isFeatured = post.isFeatured;
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { isFeatured: !isFeatured },
    { new: true },
  );

  res.status(200).json({
    status: "success",
    message: "Post updated successfully",
    post: updatedPost,
  });
};

const deletePost = async (req, res) => {
  //isAdmin
  const role = getAuth(req).sessionClaims?.metadata.role || "user";

  if (role === "admin") {
    await Post.findByIdAndDelete({
      _id: req.params.id,
    });
    return res.status(204).json({
      status: "success",
      message: "Post deleted Successfully",
      post: null,
    });
  }

  const clerkUserId = getAuth(req).userId;

  if (!clerkUserId)
    return res.status(401).json({
      error: "Unauthorized",
      message: "You do not have permission to perform this action",
    });

  const user = await User.findOne({ clerkUserId });
  if (!user)
    return res.status(404).json({
      error: "NotFound",
      message: "User not found in the DB",
    });

  const deletedPost = await Post.findByIdAndDelete({
    _id: req.params.id,
    user: user._id,
  });
  if (!deletePost)
    return res.status(403).json({
      error: "Forbidden",
      message: "You can delete only your post",
    });
  res.status(204).json({
    status: "success",
    message: "Post deleted Successfully",
    post: null,
  });
};

const uploadAuth = async (req, res) => {
  const client = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  });

  const result = client.getAuthenticationParameters();
  console.log(result);
  res.json(result);
};

const postController = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  uploadAuth,
  featurePost,
};

export default postController;
