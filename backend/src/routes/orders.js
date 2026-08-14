import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { calculateCoupon } from "../services/couponService.js";
import { serialiseOrder } from "../utils/serialiseOrder.js";

const router = Router();
router.use(requireAuth);

function createOrderNumber() {
  return `SM-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

router.get("/", async (request, response, next) => {
  try {
    const orders = await Order.find({ user: request.userId })
      .sort({ createdAt: -1 })
      .lean();
    return response.json({ orders: orders.map(serialiseOrder) });
  } catch (error) {
    return next(error);
  }
});

router.post("/checkout", async (request, response, next) => {
  try {
    const submittedItems = Array.isArray(request.body.items)
      ? request.body.items
      : [];
    if (submittedItems.length === 0 || submittedItems.length > 36) {
      return response
        .status(400)
        .json({ error: "Your bag is empty or invalid." });
    }

    const quantities = new Map();
    for (const item of submittedItems) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      if (
        !Number.isInteger(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
      ) {
        return response
          .status(400)
          .json({ error: "Each item quantity must be between 1 and 10." });
      }
      quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
    }
    if ([...quantities.values()].some((quantity) => quantity > 10)) {
      return response
        .status(400)
        .json({ error: "A maximum of 10 units per product is allowed." });
    }

    const products = await Product.find({
      productId: { $in: [...quantities.keys()] },
    }).lean();
    if (products.length !== quantities.size) {
      return response
        .status(400)
        .json({ error: "One or more products are no longer available." });
    }

    const items = products.map((product) => {
      const quantity = quantities.get(product.productId);
      return {
        productId: product.productId,
        name: product.name,
        imageFilename: product.imageFilename,
        unitPrice: product.newPrice,
        quantity,
        lineTotal: product.newPrice * quantity,
      };
    });
    const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
    const { coupon, discount } = await calculateCoupon(
      request.body.couponCode,
      subtotal,
    );

    const order = await Order.create({
      orderNumber: createOrderNumber(),
      user: request.userId,
      items,
      subtotal,
      discount,
      total: subtotal - discount,
      couponCode: coupon?.code ?? null,
    });
    return response.status(201).json({ order: serialiseOrder(order) });
  } catch (error) {
    if (error.message && error.name !== "MongooseError")
      return response.status(400).json({ error: error.message });
    return next(error);
  }
});

router.get("/:orderId", async (request, response, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(request.params.orderId)) {
      return response.status(400).json({ error: "Invalid order id." });
    }
    const order = await Order.findOne({
      _id: request.params.orderId,
      user: request.userId,
    }).lean();
    if (!order) return response.status(404).json({ error: "Order not found." });
    return response.json({ order: serialiseOrder(order) });
  } catch (error) {
    return next(error);
  }
});

export default router;
