import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });

  const uri = process.env.MONGODB_URI || "";
  // Support both full URIs and host-only URIs (append /e-commerce when needed)
  const hasDbPath =
    /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(uri) &&
    !uri.endsWith("/");
  const connectionString = hasDbPath ? uri : `${uri.replace(/\/$/, "")}/e-commerce`;

  await mongoose.connect(connectionString);
};

export default connectDB;
