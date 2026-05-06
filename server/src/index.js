import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "..", "uploads");
const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");

dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "portfolio-builder-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = status === 500 ? "Something went wrong" : err.message;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ message });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is required");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
