import { Router } from "express";
import { calculateCoupon } from "../services/couponService.js";

const router = Router();

router.post("/validate", async (request, response, next) => {
  try {
    const subtotal = Number(request.body.subtotal);
    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return response
        .status(400)
        .json({ error: "Add an item to your bag before applying a coupon." });
    }

    const { coupon, discount } = await calculateCoupon(
      request.body.code,
      subtotal,
    );
    if (!coupon) return response.json({ code: null, discount: 0, subtotal });

    return response.json({
      code: coupon.code,
      discount,
      subtotal,
      total: subtotal - discount,
    });
  } catch (error) {
    if (error.message)
      return response.status(400).json({ error: error.message });
    return next(error);
  }
});

export default router;
