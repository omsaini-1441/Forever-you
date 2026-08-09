import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "../config/mongodb.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const seed = async () => {
  await connectDB();

  const productsPath = path.join(__dirname, "../data/products.json");
  const raw = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const base = process.env.BACKEND_URL || "http://localhost:4000";

  const products = raw.map((p) => ({
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    subCategory: p.subCategory,
    sizes: p.sizes,
    bestseller: p.bestseller,
    date: p.date || Date.now(),
    image: (p.images || []).map((file) => `${base}/images/${file}`),
  }));

  await productModel.deleteMany({});
  await productModel.insertMany(products);
  console.log(`Seeded ${products.length} products`);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@forever.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
  const existingAdmin = await userModel.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    await userModel.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log("Admin user already exists");
  }

  await mongoose.disconnect();
  console.log("Seed complete");
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
