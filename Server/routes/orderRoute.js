import express from "express";
import {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
} from "../controllers/orderController.js";
import { authUser, authAdmin } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/list", authAdmin, allOrders);
orderRouter.post("/status", authAdmin, updateStatus);
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
