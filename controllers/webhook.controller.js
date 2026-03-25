import { Webhook } from "svix";
import User from "./../models/user.model.js";
import Post from "./../models/post.model.js";
import Comment from "./../models/comment.model.js";

const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new console.error("📢Webhook secret needed!");
  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);
  let event;
  try {
    event = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({
      message: "Webhook verification failed😪",
    });
  }

  if (event.type === "user.created") {
    const newUser = new User({
      clerkUserId: event.data.id,
      username:
        event.data.username || event.data.email_addresses[0].email_address,
      email: event.data.email_addresses[0].email_address,
      img: event.data.profile_image_url,
    });

    const user = await newUser.save();
    console.log(user ? "User created" : "user NOT created");
  }
  if (event.type === "user.updated") {
    const updatedUser = await User.findOneAndUpdate(
      { clerkUserId: event.data.id },
      {
        username:
          event.data.username || event.data.email_addresses[0].email_address,
        email: event.data.email_addresses[0].email_address,
        img: event.data.profile_image_url,
      },
      { new: true },
    );
    console.log(updatedUser ? "User updated✅" : "user NOT updated❌");
  }

  if (event.type === "user.deleted") {
    const deletedUser = await User.findOneAndDelete({
      clerkUserId: event.data.id,
    });

    await Post.deleteMany({ user: deletedUser._id });
    await Comment.deleteMany({ user: deletedUser._id });
  }

  return res.status(200).json({
    message: "Webhook received",
  });
};

const webHookController = { clerkWebHook };
export default webHookController;
