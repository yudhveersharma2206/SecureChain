require("dotenv").config();
const connectDB = require("./config/database");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const { limiter, authLimiter } = require("./middleware/rateLimiter");
const logRoutes = require("./routes/logroutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
// Enable pre-flight for all routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Rate limiting
//app.use("/auth", authLimiter);
 // app.use("/api/log", limiter);

// Routes
app.use("/auth", authRoutes);
app.use("/api/log", logRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});