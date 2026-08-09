import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const DELIVERY_FEE = 10;

const buildOrderItemsAndAmount = async (items) => {
  let amount = 0;
  const orderItems = [];

  for (const line of items) {
    const product = await productModel.findById(line._id || line.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const quantity = Number(line.quantity);
    if (!quantity || quantity < 1) {
      throw new Error("Invalid quantity");
    }
    amount += product.price * quantity;
    orderItems.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: line.size,
      quantity,
    });
  }

  return { orderItems, amount: amount + DELIVERY_FEE };
};

const placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    if (!items?.length) {
      return res.json({ success: false, message: "Cart is empty" });
    }
    if (!address?.firstName || !address?.phone || !address?.street) {
      return res.json({ success: false, message: "Incomplete address" });
    }

    const { orderItems, amount } = await buildOrderItemsAndAmount(items);

    const orderData = {
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed", orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, allOrders, userOrders, updateStatus };
