const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const parentRoutes = require("./routes/parentRoutes");
const shopRoutes = require("./routes/shopRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "Moms Taste API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
