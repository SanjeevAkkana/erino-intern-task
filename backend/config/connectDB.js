import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env file.");
}

// Ensure global cache exists (fixing potential undefined issue)
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (global.mongoose.conn) return global.mongoose.conn; // Return cached connection

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose
      .connect(MONGODB_URI, {
        autoIndex: false, // Disable auto-creation of indexes (optional for performance)
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        throw error; // Rethrow to avoid silent failures
      });
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectDb;