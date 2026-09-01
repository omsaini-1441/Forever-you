import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });

  const uri = process.env.MONGODB_URI || "";
  let connectionString = uri;

  if (!/mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri)) {
    const [base, query] = uri.split("?");
    connectionString = `${base.replace(/\/$/, "")}/e-commerce${query ? `?${query}` : ""}`;
  }

  await mongoose.connect(connectionString);
};

export default connectDB;
