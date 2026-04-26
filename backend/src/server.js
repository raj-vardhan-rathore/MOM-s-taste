require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    // 🔴 Check Mongo URI
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing");
      process.exit(1);
    }

    // 🔴 Connect DB
    await connectDB();
    console.log("✅ MongoDB Connected");

    // 🔴 Create server
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      },
    });

    global.io = io;

    io.on("connection", (socket) => {
      console.log("🔌 User connected:", socket.id);

      socket.on("join", (userId) => {
        socket.join(String(userId));
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    // 🔴 Start server
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🌐 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
