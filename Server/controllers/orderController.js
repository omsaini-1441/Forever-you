import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import stripe from "../config/stripe.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

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

const placeOrderStripe = async (req, res) => {
  try {
    if (!stripe) {
      return res.json({
        success: false,
        message: "Stripe is not configured. Add STRIPE_SECRET_KEY to Server/.env",
      });
    }

    const { items, address } = req.body;
    const userId = req.userId;
    const origin = req.headers.origin || process.env.CLIENT_URL;

    if (!items?.length) {
      return res.json({ success: false, message: "Cart is empty" });
    }
    if (!address?.firstName || !address?.phone || !address?.street) {
      return res.json({ success: false, message: "Incomplete address" });
    }

    const { orderItems, amount } = await buildOrderItemsAndAmount(items);

    const newOrder = new orderModel({
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
    });
    await newOrder.save();

    const line_items = orderItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: `${item.name} (${item.size})` },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Fee" },
        unit_amount: DELIVERY_FEE * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: { orderId: newOrder._id.toString(), userId },
    });

    await orderModel.findByIdAndUpdate(newOrder._id, {
      stripeSessionId: session.id,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  try {
    if (!stripe) {
      return res.json({ success: false, message: "Stripe is not configured" });
    }

    const { session_id } = req.body;
    const userId = req.userId;

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === "paid") {
      const orderId = session.metadata.orderId;
      const order = await orderModel.findById(orderId);

      if (!order || order.userId.toString() !== userId) {
        return res.json({ success: false, message: "Invalid order" });
      }

      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Order Placed",
      });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true, message: "Payment successful" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderRazorpay = async (req, res) => {
  try {
    if (!razorpay) {
      return res.json({
        success: false,
        message:
          "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Server/.env",
      });
    }

    const { items, address } = req.body;
    const userId = req.userId;

    if (!items?.length) {
      return res.json({ success: false, message: "Cart is empty" });
    }
    if (!address?.firstName || !address?.phone || !address?.street) {
      return res.json({ success: false, message: "Incomplete address" });
    }

    const { orderItems, amount } = await buildOrderItemsAndAmount(items);

    const newOrder = new orderModel({
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
    });
    await newOrder.save();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: newOrder._id.toString(),
    });

    await orderModel.findByIdAndUpdate(newOrder._id, {
      razorpayOrderId: razorpayOrder.id,
    });

    res.json({
      success: true,
      order: newOrder,
      razorpayOrderId: razorpayOrder.id,
      key_id: process.env.RAZORPAY_KEY_ID,
      amount,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.json({ success: false, message: "Razorpay is not configured" });
    }

    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    const userId = req.userId;

    const order = await orderModel.findById(orderId);
    if (!order || order.userId.toString() !== userId) {
      return res.json({ success: false, message: "Invalid order" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid payment signature" });
    }

    await orderModel.findByIdAndUpdate(orderId, {
      payment: true,
      status: "Order Placed",
    });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Payment successful" });
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

export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
