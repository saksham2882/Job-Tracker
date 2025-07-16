import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "job_tracker" });
    console.log("Connected to Database");
    return;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;