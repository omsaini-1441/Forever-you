import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "../config/mongodb.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const requireCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary env vars missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in Server/.env"
    );
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
};

const imagesDir = () => {
  const serverImages = path.join(__dirname, "../public/images");
  const clientAssets = path.join(__dirname, "../../Client/src/assets");
  if (fs.existsSync(serverImages) && fs.readdirSync(serverImages).length) {
    return serverImages;
  }
  if (fs.existsSync(clientAssets)) {
    return clientAssets;
  }
  throw new Error("No local product images found to upload");
};

const uploadImage = async (filePath, fileName, cache) => {
  if (cache.has(fileName)) return cache.get(fileName);

  const result = await cloudinary.uploader.upload(filePath, {
    folder: "forever-you",
    asset_folder: "forever-you", // Media Library folder (dynamic folders)
    public_id: path.parse(fileName).name,
    overwrite: true,
    resource_type: "image",
  });
  cache.set(fileName, result.secure_url);
  console.log(`Uploaded ${fileName}`);
  return result.secure_url;
};

const seed = async () => {
  requireCloudinary();
  await connectDB();

  const productsPath = path.join(__dirname, "../data/products.json");
  const raw = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const dir = imagesDir();
  const urlCache = new Map();

  console.log(`Uploading images from ${dir} → Cloudinary (forever-you/)`);

  const products = [];
  for (const p of raw) {
    const imageUrls = [];
    for (const file of p.images || []) {
      const filePath = path.join(dir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing image file: ${filePath}`);
      }
      imageUrls.push(await uploadImage(filePath, file, urlCache));
    }
    products.push({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      subCategory: p.subCategory,
      sizes: p.sizes,
      bestseller: p.bestseller,
      date: p.date || Date.now(),
      image: imageUrls,
    });
  }

  await productModel.deleteMany({});
  await productModel.insertMany(products);
  console.log(
    `Seeded ${products.length} products (${urlCache.size} unique Cloudinary images)`
  );

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
  console.log("Seed complete — all product images are on Cloudinary");
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
