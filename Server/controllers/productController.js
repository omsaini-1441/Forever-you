import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cloudinaryReady = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const saveLocalImage = (file) => {
  const imagesDir = path.join(__dirname, "../public/images");
  fs.mkdirSync(imagesDir, { recursive: true });
  const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
  const dest = path.join(imagesDir, filename);
  fs.copyFileSync(file.path, dest);
  try {
    fs.unlinkSync(file.path);
  } catch {
    /* ignore */
  }
  const base = process.env.BACKEND_URL || "http://localhost:4000";
  return `${base}/images/${filename}`;
};

const uploadImage = async (file) => {
  if (cloudinaryReady()) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "forever-you",
      asset_folder: "forever-you",
    });
    try {
      fs.unlinkSync(file.path);
    } catch {
      /* ignore */
    }
    return result.secure_url;
  }
  return saveLocalImage(file);
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } =
      req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);
    const imagesUrl = await Promise.all(images.map((img) => uploadImage(img)));

    let parsedSizes = sizes;
    if (typeof sizes === "string") {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch {
        // tolerate curl/form values like S,M,L or [S,M,L]
        parsedSizes = sizes
          .replace(/[\[\]]/g, "")
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      }
    }

    const productData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestseller: bestseller === "true" || bestseller === true,
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ date: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
