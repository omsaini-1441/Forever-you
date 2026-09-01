import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/mongodb.js";
import mongoose from "mongoose";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import {
  generalLimiter,
  authLimiter,
  orderLimiter,
} from "./middleware/rateLimit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === "production";

connectDB();
connectCloudinary();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "https://forever-you-seven.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(generalLimiter);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (!isProd) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  })
);

app.use(express.json({ limit: "10mb" }));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/user", authLimiter, userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderLimiter, orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/api/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const mongoState = mongoose.connection.readyState;
  res.json({
    ok: mongoState === 1,
    mongo: states[mongoState] ?? mongoState,
  });
});

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: "CORS blocked" });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    message: isProd ? "Internal server error" : err.message,
  });
});

app.listen(port, "0.0.0.0", () => console.log("Server running on PORT:" + port));
