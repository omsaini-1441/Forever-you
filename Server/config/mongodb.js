import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "";
  if (!uri) {
    console.error("MONGODB_URI is missing — set it in Render environment variables");
    return;
  }

  let connectionString = uri;
  if (!/mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri)) {
    const [base, query] = uri.split("?");
    connectionString = `${base.replace(/\/$/, "")}/e-commerce${query ? `?${query}` : ""}`;
  }

  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error("MongoDB connect failed:", error.message);
  }
};

export default connectDB;
