import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB() {
  const connectStart = performance.now();

  try {
    console.log("🔁 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `✅ MongoDB connected successfully in ${(performance.now() - connectStart).toFixed(2)} ms`
    );
  } catch (error) {
    console.error(
      `❌ MongoDB connection failed after ${(performance.now() - connectStart).toFixed(2)} ms:`,
      error.message
    );
    process.exit(1);
  }
}
