require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/database");

const serviceRoutes = require("./routes/serviceRoutes");
const requirementRoutes = require("./routes/requirementRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 1234;

const frontendDist = path.join(__dirname, "../frontend/dist");

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/services", serviceRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Serve frontend files from the same server
app.use(express.static(frontendDist));

// Send the frontend index.html for client-side routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  if (req.method !== "GET") {
    return next();
  }

  res.sendFile(path.join(frontendDist, "index.html"), (error) => {
    if (error) {
      next(error);
    }
  });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT}`);
  });
};

startServer();
