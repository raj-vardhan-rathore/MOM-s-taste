const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    console.log("🔗 URI:", process.env.MONGO_URI); // DEBUG

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("✅ MongoDB connected successfully");

  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error); // FULL ERROR

    process.exit(1);
  }
};

module.exports = connectDB;
