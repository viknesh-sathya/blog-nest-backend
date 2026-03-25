import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB = process.env.DATABASE_URL.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD,
    );

    if (!DB) {
      throw new Error(
        "❌ DATABASE_URL is not defined in environment variables",
      );
    }

    await mongoose.connect(DB);

    console.log("❤️ MongoDB is connected ❤️");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
