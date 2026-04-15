require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
  });

  global.io = io;

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      socket.join(String(userId));
    });

    socket.on("disconnect", () => {
      // no-op
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
